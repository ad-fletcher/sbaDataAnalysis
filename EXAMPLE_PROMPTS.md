# Example Prompts for Testing

## Loan Statistics Tool

Try asking the AI:

```
Get loan statistics for NAICS code 5413 (architectural and engineering services) in Texas
```

```
Show me loan data for NAICS 5413 in zip code 78701 within 50 miles
```

```
What are the default rates and risk premium for architectural firms (NAICS 5413) in California?
```

## Top Banks Tool

Try asking the AI:

```
Show me the top 5 banks providing loans to NAICS 5413 businesses in Texas
```

```
Which banks are lending to architectural services companies (NAICS 5413) in zip code 94102?
```

```
Find the top banks for NAICS code 5413 in New York state
```

## Combined Analysis

Try asking the AI:

```
Give me a complete analysis of SBA loans for NAICS 5413 in Texas, including statistics and top banks
```

## Competitive Landscape Analysis

**🎉 NEW: Competitive landscape is now AUTO-INCLUDED in all comprehensive analyses!**

When you run ANY analysis (state or ZIP code), the competitive landscape cards will automatically appear alongside loan statistics and top banks.

### Standard Analysis (Includes Everything!)

Try asking the AI:

```
Analyze professional services in Texas
```
→ Gets: Loan Stats + **Competitive Landscape** + Top Banks

```
Show me steel manufacturing in California statewide
```
→ Gets: Loan Stats + **Competitive Landscape** + Top Banks

```
Analyze architectural firms in ZIP 90001
```
→ Gets: Loan Stats + **Competitive Landscape** + Top Banks (if zipRange = 0)

### Competitive-Only Requests

If you ONLY want competitive analysis (no loan data):

```
Just show me the competitive landscape for professional services in Texas
```

```
I only need market competition data for NAICS 5413 in 94102
```

### Follow-Up Questions

After seeing the cards, ask for more detail:

```
Tell me more about the entry barriers
```

```
Which counties should I focus on?
```

```
How does my 50-person company compare?
```

```
What do those percentiles mean?
```

### Advanced Questions

```
I have 100 employees. Analyze my competitive position in California for NAICS 5413
```

```
Which Texas counties have the most steel manufacturing activity?
```

```
Is the market in Florida fragmented or concentrated for professional services?
```

## NAICS Code Reference

- **5413**: Architectural, Engineering, and Related Services
- **54**: Professional, Scientific, and Technical Services
- **62**: Health Care and Social Assistance
- **72**: Accommodation and Food Services

## How It Works

1. The AI will automatically invoke the appropriate tools based on your question
2. You'll see "Loading..." messages while the data is being fetched
3. Beautiful cards will display the loan statistics and top banks information
4. For competitive landscape, the AI will provide conversational analysis of market structure, entry barriers, and positioning
5. Data comes from your Supabase database through the functions in `lib/supabase/functions.ts`

## Competitive Analysis Features

When you ask about competitive landscape, you'll learn about:

- **Market Concentration** - Is it fragmented (many competitors) or consolidated (few big players)?
- **Entry Barriers** - How hard is it to enter? Labor costs, scale requirements
- **Company Positioning** - Where does your company rank by size?
- **Size Distribution** - What percentage are micro, small, medium, large firms?
- **Industry Specificity** - Is this area a hub for your industry?
- **Geographic Insights** - Which counties/areas are the hotspots?
- **Payroll Analysis** - What are typical salaries in this industry/location?

## States with Competitive Data Coverage

Currently supported: **AK, AL, AR, AZ, CA, CO, CT, DC, DE, FL, GA, HI, IA, ID, IL, IN, KS, KY, LA, MA, MD, ME, TX**

If you ask about other states, the AI will let you know and suggest alternatives.

