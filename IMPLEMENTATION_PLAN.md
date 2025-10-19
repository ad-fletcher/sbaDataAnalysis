# NAICS Direct Input Mode - Implementation Plan

## Overview
Add a dual-mode interface that allows users to:
1. **Direct Input Mode** (NEW): Enter NAICS codes directly with location filters
2. **Chat Mode** (EXISTING): Conversational AI-guided analysis

## Architecture Changes

### 1. Mode Toggle System
- Add a prominent mode toggle at the top of the interface
- Two modes: "Direct Input" and "Chat Mode"
- Smooth transitions between modes
- Persist mode preference in localStorage

### 2. Direct Input Interface Components

#### 2.1 NAICS Code Input Component
**File: `components/input/NAICSInputForm.tsx`**
- Input field for multiple NAICS codes (comma-separated or array input)
- Support for 2-6 digit NAICS codes
- Real-time validation
- Ability to add/remove codes dynamically
- Visual chips/tags for entered codes

#### 2.2 Location Filter Component
**File: `components/input/LocationFilter.tsx`**
- Radio button or tabs for "State" vs "Zip Code"
- State dropdown (all 50 states + DC)
- Zip code input with validation
- Zip range slider (10-100 miles) when zip is selected
- Clear visual separation between mutually exclusive options

#### 2.3 Analysis Options
**File: `components/input/AnalysisOptions.tsx`**
- Top N banks selector (default: 3, range: 1-10)
- Quick preset buttons for common NAICS categories:
  - Manufacturing
  - Retail
  - Services
  - Construction
  - Healthcare
  - Technology

#### 2.4 Direct Analysis Trigger
- Large, prominent "Run Analysis" button
- Shows loading state during analysis
- Displays results in the same card format as chat mode

### 3. Updated Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  Header: "AI Financial Analyst"                         │
│  [Direct Input Mode] [Chat Mode] ← Toggle Buttons       │
└─────────────────────────────────────────────────────────┘
│                                                          │
│  ┌────────────── DIRECT INPUT MODE ──────────────┐      │
│  │                                                │      │
│  │  NAICS Codes: [331110] [332312] [+Add]       │      │
│  │                                                │      │
│  │  Location:                                     │      │
│  │    ○ State: [Select State ▼]                  │      │
│  │    ○ Zip Code: [_____] Range: [40 mi]        │      │
│  │                                                │      │
│  │  Options:                                      │      │
│  │    Top Banks: [3 ▼]                           │      │
│  │                                                │      │
│  │         [Run Analysis]                         │      │
│  └────────────────────────────────────────────────┘      │
│                                                          │
│  ┌─────────── ANALYSIS RESULTS ──────────────────┐      │
│  │  [LoanStatistics Cards]                        │      │
│  │  [TopBanks Cards]                              │      │
│  └────────────────────────────────────────────────┘      │
│                                                          │
│  ──────────── OR ────────────                           │
│                                                          │
│  ┌────────────── CHAT MODE ─────────────────────┐      │
│  │  [Chat Messages]                              │      │
│  │  [Input Field]                                │      │
│  └────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────┘
```

## Implementation Steps

### Phase 1: Core Infrastructure (1-2 hours)

1. **Create Mode Context**
   - File: `lib/context/ModeContext.tsx`
   - Manages current mode state
   - Provides toggle function
   - Persists to localStorage

2. **Create Types**
   - File: `lib/types/analysis.ts`
   - Define interfaces for direct input parameters
   - Analysis results types
   - Form validation schemas

### Phase 2: Input Components (2-3 hours)

1. **NAICS Input Component**
   ```typescript
   // Features:
   - Tag-based input with visual chips
   - Add/remove functionality
   - Validation (2-6 digit numbers)
   - Suggestions from common codes
   - Copy/paste multiple codes support
   ```

2. **Location Filter Component**
   ```typescript
   // Features:
   - State selector with search
   - Zip code input with validation
   - Zip range slider (visual feedback)
   - Mutual exclusivity enforcement
   ```

3. **Analysis Options Component**
   ```typescript
   // Features:
   - Top N selector
   - Quick preset buttons
   - Reset to defaults button
   ```

### Phase 3: Direct Analysis Flow (2-3 hours)

1. **Create Analysis Hook**
   - File: `lib/hooks/useDirectAnalysis.ts`
   - Handles form submission
   - Calls API directly (not through chat)
   - Manages loading states
   - Error handling

2. **Create API Route** (or use existing)
   - File: `app/api/analysis/route.ts` (NEW)
   - Direct endpoint for non-chat analysis
   - Same underlying functions as chat mode
   - Faster response (no streaming needed)
   - Returns structured JSON

3. **Results Display**
   - Reuse existing `LoanStatistics` and `TopBanks` components
   - Add container component for direct mode results
   - Show timestamp of analysis
   - Add "Export" and "Share" buttons

### Phase 4: UI Improvements (2-3 hours)

1. **Header Improvements**
   ```typescript
   - Modern gradient design
   - Animated mode toggle
   - Clear visual indication of current mode
   - Add subtitle: "SBA Loan Data Analysis"
   ```

2. **Layout Improvements**
   ```typescript
   - Better spacing and padding
   - Card-based design for input sections
   - Smooth transitions between modes
   - Responsive breakpoints for mobile
   ```

3. **Visual Enhancements**
   ```typescript
   - Add icons to inputs (lucide-react)
   - Hover effects on interactive elements
   - Loading skeletons for results
   - Success animations after analysis
   - Improved color scheme consistency
   ```

4. **Dark Mode Polish**
   ```typescript
   - Ensure all new components support dark mode
   - Consistent color palette
   - Proper contrast ratios
   ```

### Phase 5: Enhanced Features (1-2 hours)

1. **Quick Actions**
   - "Recent Analyses" dropdown
   - "Favorite NAICS Codes" list
   - "Share Configuration" button

2. **Validation & Help**
   - Inline help tooltips
   - NAICS code lookup helper
   - Example queries/configurations
   - Error messages with suggestions

3. **Results Enhancement**
   - Add comparison view (if multiple analyses run)
   - Export to CSV/PDF
   - Copy shareable link
   - Save analysis to history

### Phase 6: Testing & Polish (1 hour)

1. **Functionality Testing**
   - Test all input combinations
   - Verify state/zip mutual exclusivity
   - Test error handling
   - Verify results display correctly

2. **UI/UX Testing**
   - Mobile responsiveness
   - Keyboard navigation
   - Screen reader compatibility
   - Cross-browser testing

3. **Performance**
   - Optimize component re-renders
   - Lazy load heavy components
   - Debounce API calls

## Detailed File Structure

```
analyst/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts              # Existing chat endpoint
│   │   └── analysis/
│   │       └── route.ts              # NEW: Direct analysis endpoint
│   └── page.tsx                       # UPDATED: Mode switching logic
├── components/
│   ├── input/                         # NEW: Input components
│   │   ├── NAICSInputForm.tsx
│   │   ├── LocationFilter.tsx
│   │   ├── AnalysisOptions.tsx
│   │   └── DirectInputContainer.tsx
│   ├── layout/                        # NEW: Layout components
│   │   ├── ModeToggle.tsx
│   │   ├── Header.tsx
│   │   └── ResultsContainer.tsx
│   ├── analysis/                      # EXISTING: Keep as-is
│   │   ├── LoanStatistics.tsx
│   │   └── TopBanks.tsx
│   └── ui/                           # EXISTING: shadcn components
├── lib/
│   ├── context/
│   │   └── ModeContext.tsx           # NEW: Mode state management
│   ├── hooks/
│   │   └── useDirectAnalysis.ts      # NEW: Direct analysis logic
│   ├── types/
│   │   └── analysis.ts               # NEW: TypeScript types
│   └── validators/
│       └── naics.ts                  # NEW: NAICS validation logic
```

## UI Improvements Checklist

### Visual Design
- [ ] Modern, clean header with gradient
- [ ] Card-based sections with shadows
- [ ] Consistent spacing (4px, 8px, 16px, 24px system)
- [ ] Hover effects on all interactive elements
- [ ] Smooth transitions (200-300ms)
- [ ] Icon integration throughout

### User Experience
- [ ] Clear mode indication
- [ ] Immediate visual feedback on actions
- [ ] Loading states for all async operations
- [ ] Helpful error messages
- [ ] Inline validation
- [ ] Keyboard shortcuts (optional)

### Accessibility
- [ ] Proper heading hierarchy
- [ ] ARIA labels on all inputs
- [ ] Focus indicators
- [ ] Screen reader announcements
- [ ] Color contrast compliance (WCAG AA)

### Responsive Design
- [ ] Mobile-first approach
- [ ] Breakpoints: 640px, 768px, 1024px, 1280px
- [ ] Touch-friendly tap targets (44x44px min)
- [ ] Collapsible sections on mobile
- [ ] Optimized layouts for tablet

## API Design for Direct Analysis

### Endpoint: `POST /api/analysis`

**Request Body:**
```typescript
{
  naicsCodes: number[],        // Array of NAICS codes
  location: {
    type: 'state' | 'zipCode',
    value: string | number,
    zipRange?: number          // Only if type is zipCode
  },
  options: {
    topN: number               // Number of top banks (default: 3)
  }
}
```

**Response:**
```typescript
{
  success: boolean,
  data: {
    loanStatistics: { /* same as chat mode */ },
    bankResults: { /* same as chat mode */ }
  },
  metadata: {
    timestamp: string,
    naicsCodes: number[],
    location: object,
    executionTime: number
  },
  error?: string
}
```

## State Management

### Mode State
```typescript
type Mode = 'direct' | 'chat'

interface ModeContext {
  currentMode: Mode
  setMode: (mode: Mode) => void
  toggleMode: () => void
}
```

### Direct Input State
```typescript
interface DirectInputState {
  naicsCodes: number[]
  locationType: 'state' | 'zipCode'
  stateCode?: string
  zipCode?: number
  zipRange: number
  topN: number
  isLoading: boolean
  results?: AnalysisResults
  error?: string
}
```

## Component Props

### NAICSInputForm
```typescript
interface NAICSInputFormProps {
  codes: number[]
  onChange: (codes: number[]) => void
  maxCodes?: number           // Default: 6
  suggestions?: number[]      // Popular NAICS codes
}
```

### LocationFilter
```typescript
interface LocationFilterProps {
  type: 'state' | 'zipCode'
  onTypeChange: (type: 'state' | 'zipCode') => void
  stateCode?: string
  onStateChange: (state: string) => void
  zipCode?: number
  onZipChange: (zip: number) => void
  zipRange: number
  onZipRangeChange: (range: number) => void
}
```

## Styling Improvements

### Color Palette
```css
/* Primary */
--primary-50: #eff6ff
--primary-100: #dbeafe
--primary-500: #3b82f6
--primary-600: #2563eb
--primary-700: #1d4ed8

/* Success */
--success-500: #10b981
--success-600: #059669

/* Warning */
--warning-500: #f59e0b
--warning-600: #d97706

/* Error */
--error-500: #ef4444
--error-600: #dc2626
```

### Component Styling Patterns
```typescript
// Input containers
className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800"

// Buttons
className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"

// Input fields
className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500"
```

## Testing Scenarios

### Direct Input Mode
1. ✓ Enter single NAICS code + state → Get results
2. ✓ Enter multiple NAICS codes + zip code → Get results
3. ✓ Invalid NAICS code → Show error
4. ✓ No location selected → Show validation error
5. ✓ Switch between state and zip → Clear previous values
6. ✓ Adjust zip range → Update results
7. ✓ Change top N value → Update results

### Mode Switching
1. ✓ Switch from chat to direct → Maintain state
2. ✓ Switch from direct to chat → Maintain state
3. ✓ Refresh page → Persist mode preference

### Edge Cases
1. ✓ Network error → Show friendly error message
2. ✓ No data found → Show "No results" state
3. ✓ Very slow query → Show loading state with progress
4. ✓ Invalid state code → Validate and show error

## Timeline

| Phase | Task | Time | Priority |
|-------|------|------|----------|
| 1 | Core Infrastructure | 1-2h | P0 |
| 2 | Input Components | 2-3h | P0 |
| 3 | Direct Analysis Flow | 2-3h | P0 |
| 4 | UI Improvements | 2-3h | P0 |
| 5 | Enhanced Features | 1-2h | P1 |
| 6 | Testing & Polish | 1h | P0 |
| **Total** | | **9-14h** | |

## Success Metrics

✅ Users can enter NAICS codes directly
✅ Results display in < 2 seconds
✅ Zero confusion about which mode they're in
✅ Mobile experience is excellent
✅ No breaking changes to existing chat functionality
✅ UI looks modern and professional
✅ All accessibility standards met

## Next Steps

1. Review and approve this plan
2. Start with Phase 1 (Core Infrastructure)
3. Build incrementally, testing each component
4. Deploy to staging for user testing
5. Iterate based on feedback
6. Deploy to production

---

**Questions to Consider:**
1. Should we save analysis history?
2. Do we need authentication for saved analyses?
3. Should there be rate limiting on direct API calls?
4. Do we want to add comparison mode between analyses?
5. Should we support bulk NAICS code upload (CSV)?

