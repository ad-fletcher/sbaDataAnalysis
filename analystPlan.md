# AI Financial Analyst - Comprehensive Implementation Plan

## Project Overview
Build an intelligent AI analyst chat application that allows users to research companies by providing a company description and location (state or zip code). The system will use an orchestrator agent with specialized sub-agents to retrieve NAICS codes, perform financial analysis using Supabase database functions, and display rich UI components in the chat interface using the Vercel AI SDK.

---

## Architecture Overview

### Agent System
1. **Orchestrator Agent** - Main coordinator that:
   - Interprets user queries
   - Delegates tasks to specialized agents
   - Manages conversation flow
   - Aggregates results

2. **NAICS Lookup Agent** - Specialized for:
   - Interpreting company descriptions
   - Using web search to find accurate NAICS codes
   - Validating NAICS codes against database

3. **Financial Analysis Agent** - Handles:
   - Executing Supabase RPC functions
   - Processing loan data statistics
   - Formatting analysis results

4. **Data Visualization Agent** - Responsible for:
   - Creating UI components for results
   - Generating charts and tables
   - Formatting data for display

---

## Phase 1: Project Setup & Dependencies

### 1.1 Install Required Packages
```bash
# Core AI SDK
pnpm add ai @ai-sdk/openai @ai-sdk/react

# Supabase
pnpm add @supabase/supabase-js

# UI Components (shadcn/ui)
pnpm add @radix-ui/react-avatar @radix-ui/react-slot
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu
pnpm add @radix-ui/react-tabs @radix-ui/react-separator
pnpm add class-variance-authority clsx tailwind-merge
pnpm add lucide-react

# Charts & Data Visualization
pnpm add recharts
# Note: Removed @tremor/react due to React 19 peer dependency conflicts
# Recharts alone provides all needed chart functionality

# Zod for validation
pnpm add zod

# Dev dependencies
pnpm add -D @types/node
```

### 1.2 Initialize shadcn/ui
```bash
npx shadcn@latest init
```

### 1.3 Add Required shadcn Components
```bash
npx shadcn@latest add card
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add badge
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add skeleton
npx shadcn@latest add alert
npx shadcn@latest add avatar
npx shadcn@latest add separator
```

### 1.4 Environment Variables Setup
Create/update `.env.local`:
```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## Phase 2: Supabase Integration

### 2.1 Create Supabase Client
**File: `lib/supabase/client.ts`**
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### 2.2 Create Server-Side Supabase Client
**File: `lib/supabase/server.ts`**
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

### 2.3 Create Type-Safe Function Wrappers
**File: `lib/supabase/functions.ts`**

Wrap the three Supabase functions:
- `get_loan_data_stats(p_state, p_zip_code, p_naics_prefixes, p_zip_range)`
- `get_loan_stats(p_state, p_zip_code, p_naics_prefixes, p_zip_range)`
- `get_top_banks_info(p_state, p_zip_code, p_naics_prefixes, p_zip_range, p_top_n)`

```typescript
export async function getLoanDataStats(params: {
  state?: string
  zipCode?: number
  naicsPrefixes: number[]
  zipRange?: number
}) {
  const { data, error } = await supabaseAdmin.rpc('get_loan_data_stats', {
    p_state: params.state || null,
    p_zip_code: params.zipCode || null,
    p_naics_prefixes: params.naicsPrefixes,
    p_zip_range: params.zipRange || 40
  })
  
  if (error) throw error
  return data
}

// Similar wrappers for get_loan_stats and get_top_banks_info
```

---

## Phase 3: AI Agent System with Vercel AI SDK

### 3.1 Define Tool Schema
**File: `lib/ai/tools.ts`**

Create tools using the Vercel AI SDK's tool system:

```typescript
import { tool } from 'ai'
import { z } from 'zod'

export const tools = {
  // Tool 1: Search for NAICS code
  searchNAICS: tool({
    description: 'Search for NAICS code based on company description',
    parameters: z.object({
      companyDescription: z.string().describe('Description of the company business'),
    }),
    execute: async ({ companyDescription }) => {
      // Use web search or AI to find NAICS code
      // Return NAICS code(s)
    },
  }),

  // Tool 2: Get loan statistics
  getLoanStatistics: tool({
    description: 'Get loan statistics for a specific NAICS code and location',
    parameters: z.object({
      naicsCodes: z.array(z.number()).describe('Array of NAICS codes'),
      state: z.string().optional().describe('Two-letter state code'),
      zipCode: z.number().optional().describe('5-digit zip code'),
      zipRange: z.number().default(40).describe('Range around zip code'),
    }),
    execute: async ({ naicsCodes, state, zipCode, zipRange }) => {
      const stats = await getLoanDataStats({
        state,
        zipCode,
        naicsPrefixes: naicsCodes,
        zipRange,
      })
      return stats
    },
  }),

  // Tool 3: Get top banks
  getTopBanks: tool({
    description: 'Get top banks for a specific NAICS code and location',
    parameters: z.object({
      naicsCodes: z.array(z.number()),
      state: z.string().optional(),
      zipCode: z.number().optional(),
      zipRange: z.number().default(40),
      topN: z.number().default(3),
    }),
    execute: async ({ naicsCodes, state, zipCode, zipRange, topN }) => {
      const banks = await getTopBanksInfo({
        state,
        zipCode,
        naicsPrefixes: naicsCodes,
        zipRange,
        topN,
      })
      return banks
    },
  }),
}
```

### 3.2 Create the Orchestrator Agent Route
**File: `app/api/chat/route.ts`**

```typescript
import { openai } from '@ai-sdk/openai'
import { streamText, UIMessage, convertToModelMessages } from 'ai'
import { tools } from '@/lib/ai/tools'

export const maxDuration = 60

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: openai('gpt-4o'),
    system: `You are a financial analyst assistant specializing in SBA loan data analysis.
    
Your role is to:
1. Help users research companies by understanding their business description
2. Determine the appropriate NAICS code(s) for the business
3. Analyze loan data from the Supabase database using the provided tools
4. Present findings in a clear, professional manner

When a user describes a company:
- First, use the searchNAICS tool to find the appropriate NAICS code(s)
- Then use getLoanStatistics to get comprehensive loan data
- Use getTopBanks to identify top lenders for that industry
- Present the data in an organized, easy-to-understand format

Always ask clarifying questions if the location (state or zip code) is not provided.`,
    messages: convertToModelMessages(messages),
    tools,
    maxSteps: 10, // Allow multi-step reasoning
  })

  return result.toUIMessageStreamResponse()
}
```

### 3.3 Update System Prompt for Multi-Agent Orchestration
The orchestrator should:
- Understand user intent
- Break down complex queries into steps
- Call appropriate tools in sequence
- Synthesize results into coherent responses

---

## Phase 4: UI Components with Vercel AI SDK

### 4.1 Create Analysis Result Components
**File: `components/analysis/LoanStatsCard.tsx`**

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function LoanStatsCard({ data }: { data: any }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Loan Statistics
          <Badge variant="outline">Analysis</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Pre-COVID Default Rate</p>
            <p className="text-2xl font-bold">{data.preCovidDefaultRate}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Recent 3yr Default Rate</p>
            <p className="text-2xl font-bold">{data.recent3yrDefaultRate}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg Months to PIF</p>
            <p className="text-2xl font-bold">{data.avgMonthsToPif}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">% Sold Before 2020</p>
            <p className="text-2xl font-bold">{data.pctSoldBefore2020}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

**File: `components/analysis/TopBanksTable.tsx`**

```typescript
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function TopBanksTable({ banks }: { banks: any[] }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Top Lenders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bank Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Total Loans</TableHead>
              <TableHead>Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banks.map((bank, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{bank.bank_name}</TableCell>
                <TableCell>{bank.bank_city}, {bank.bank_state}</TableCell>
                <TableCell>{bank.loan_count}</TableCell>
                <TableCell>${(bank.total_amount / 1000000).toFixed(2)}M</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
```

### 4.2 Update Chat UI to Use Vercel AI SDK's RSC Pattern
**File: `app/page.tsx`**

```typescript
'use client'

import { useChat } from '@ai-sdk/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { LoanStatsCard } from '@/components/analysis/LoanStatsCard'
import { TopBanksTable } from '@/components/analysis/TopBanksTable'

export default function ChatPage() {
  const { messages, sendMessage, input, setInput, isLoading } = useChat()

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            AI Financial Analyst
          </h1>
          <p className="text-sm text-muted-foreground">
            SBA Loan Data Analysis & Company Research
          </p>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">
                Welcome to AI Financial Analyst
              </h2>
              <p className="text-muted-foreground">
                Describe a company and location to get started with loan analysis
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className="mb-6">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarFallback>
                    {message.role === 'user' ? 'U' : 'AI'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  {message.parts.map((part, idx) => {
                    switch (part.type) {
                      case 'text':
                        return (
                          <Card key={idx} className="p-4 mb-2">
                            <p className="whitespace-pre-wrap">{part.text}</p>
                          </Card>
                        )
                      case 'tool-call':
                        return (
                          <Card key={idx} className="p-3 mb-2 bg-blue-50 dark:bg-blue-950/20">
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                              🔧 Using tool: {part.toolName}
                            </p>
                          </Card>
                        )
                      case 'tool-result':
                        // Render custom UI components based on tool results
                        if (part.toolName === 'getLoanStatistics') {
                          return <LoanStatsCard key={idx} data={part.result} />
                        }
                        if (part.toolName === 'getTopBanks') {
                          return <TopBanksTable key={idx} banks={part.result} />
                        }
                        return (
                          <Card key={idx} className="p-3 mb-2">
                            <pre className="text-xs overflow-auto">
                              {JSON.stringify(part.result, null, 2)}
                            </pre>
                          </Card>
                        )
                    }
                  })}
                </div>
              </div>
              <Separator className="my-4" />
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <Avatar>
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <Card className="p-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200" />
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky bottom-0">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (input.trim()) {
                sendMessage({ text: input })
                setInput('')
              }
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g., 'Analyze restaurants in San Francisco' or 'Show me loan data for tech companies in Austin, TX'"
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
```

---

## Phase 5: Implement NAICS Code Lookup

### 5.1 Create Web Search Integration
**File: `lib/ai/naics-search.ts`**

```typescript
export async function searchNAICSCode(companyDescription: string): Promise<{
  code: number
  description: string
  confidence: string
}[]> {
  // Use OpenAI with web search to find NAICS codes
  // Or integrate with a NAICS API
  // Return array of possible NAICS codes with descriptions
}
```

### 5.2 Add NAICS Validation Against Database
**File: `lib/supabase/naics-validator.ts`**

```typescript
export async function validateNAICSCode(naicsCode: number) {
  const { data, error } = await supabaseAdmin
    .from('loan_data')
    .select('naics_code, naics_description')
    .eq('naics_code', naicsCode)
    .limit(1)
    .single()
  
  return !!data
}

export async function searchNAICSInDatabase(searchTerm: string) {
  const { data } = await supabaseAdmin
    .from('loan_data')
    .select('naics_code, naics_description')
    .ilike('naics_description', `%${searchTerm}%`)
    .limit(10)
  
  return data
}
```

---

## Phase 6: Enhanced UI Features

### 6.1 Add Loading Skeletons
**File: `components/ui/analysis-skeleton.tsx`**

```typescript
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function AnalysisSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

### 6.2 Add Charts with Recharts
**File: `components/analysis/DefaultRateChart.tsx`**

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

export function DefaultRateChart({ data }: { data: any }) {
  const chartData = [
    { name: 'Pre-COVID', rate: data.preCovidDefaultRate },
    { name: 'Recent 3yr', rate: data.recent3yrDefaultRate },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Default Rate Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart width={500} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="rate" stroke="#3b82f6" />
        </LineChart>
      </CardContent>
    </Card>
  )
}
```

### 6.3 Add Error Handling UI
**File: `components/ui/error-alert.tsx`**

```typescript
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export function ErrorAlert({ error }: { error: string }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
}
```

---

## Phase 7: Advanced Features

### 7.1 Add Conversation History
Store conversations in localStorage or Supabase

### 7.2 Add Export Functionality
Allow users to export analysis results as PDF or CSV

### 7.3 Add Comparison Mode
Allow users to compare multiple companies side-by-side

### 7.4 Add Saved Searches
Let users save and retrieve previous analyses

---

## Phase 8: Testing & Optimization

### 8.1 Test Cases
1. Test with various company descriptions
2. Test with different locations (states and zip codes)
3. Test error handling for invalid NAICS codes
4. Test with multiple NAICS codes
5. Test UI responsiveness on mobile devices

### 8.2 Performance Optimization
- Implement caching for NAICS lookups
- Add database query optimization
- Implement request debouncing
- Add loading states for all async operations

### 8.3 Security
- Validate all user inputs
- Sanitize database queries
- Implement rate limiting
- Use environment variables for all secrets

---

## Phase 9: Deployment

### 9.1 Pre-Deployment Checklist
- [ ] Environment variables configured
- [ ] Supabase RLS policies reviewed
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Mobile responsive tested
- [ ] API rate limits configured

### 9.2 Deploy to Vercel
```bash
vercel --prod
```

### 9.3 Post-Deployment
- Monitor error logs
- Track API usage
- Gather user feedback
- Iterate on UI/UX

---

## Best Practices Summary

### Vercel AI SDK
- Use `streamText` for streaming responses
- Implement tools with proper Zod schemas
- Use `maxSteps` for multi-step agent reasoning
- Handle tool results in UI with custom components
- Use `useChat` hook for React integration

### React/Next.js
- Use Server Components where possible
- Implement proper error boundaries
- Use TypeScript for type safety
- Follow Next.js App Router conventions
- Optimize for Core Web Vitals

### shadcn/ui
- Use consistent component patterns
- Implement dark mode support
- Follow accessibility guidelines
- Use Tailwind CSS for custom styling
- Maintain visual hierarchy

### Supabase
- Use RPC functions for complex queries
- Implement proper RLS policies
- Use prepared statements for security
- Cache frequently accessed data
- Monitor query performance

---

## File Structure

```
analyst/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Main AI agent endpoint
│   ├── layout.tsx
│   ├── page.tsx                   # Main chat interface
│   └── globals.css
├── components/
│   ├── ui/                        # shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   └── ...
│   └── analysis/                  # Custom analysis components
│       ├── LoanStatsCard.tsx
│       ├── TopBanksTable.tsx
│       ├── DefaultRateChart.tsx
│       └── AnalysisSkeleton.tsx
├── lib/
│   ├── ai/
│   │   ├── tools.ts               # AI tool definitions
│   │   └── naics-search.ts        # NAICS lookup logic
│   ├── supabase/
│   │   ├── client.ts              # Client-side Supabase
│   │   ├── server.ts              # Server-side Supabase
│   │   ├── functions.ts           # RPC function wrappers
│   │   └── naics-validator.ts     # NAICS validation
│   └── utils.ts                   # Utility functions
├── .env.local
├── package.json
└── tsconfig.json
```

---

## Timeline Estimate

- **Phase 1-2** (Setup & Supabase): 2-3 hours
- **Phase 3** (AI Agent System): 4-6 hours
- **Phase 4** (UI Components): 4-5 hours
- **Phase 5** (NAICS Lookup): 2-3 hours
- **Phase 6** (Enhanced UI): 3-4 hours
- **Phase 7** (Advanced Features): 6-8 hours (optional)
- **Phase 8** (Testing): 2-3 hours
- **Phase 9** (Deployment): 1-2 hours

**Total: 24-34 hours**

---

## Success Criteria

✅ User can describe a company and get relevant NAICS code(s)
✅ User can specify location by state or zip code
✅ System retrieves accurate loan statistics from Supabase
✅ Analysis results display in beautiful, modern UI components
✅ Multi-agent orchestration works seamlessly
✅ Chat interface is responsive and intuitive
✅ Error handling is comprehensive
✅ Performance is optimized for production use

---

## Next Steps

1. Start with Phase 1: Install all dependencies
2. Set up Supabase client and test connection
3. Implement basic chat UI with shadcn
4. Create AI agent route with tools
5. Test end-to-end flow with simple query
6. Iterate and enhance based on results

