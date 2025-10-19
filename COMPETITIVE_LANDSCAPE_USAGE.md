# Competitive Landscape Report - Usage Guide

## Quick Start

The Competitive Landscape Report automatically appears when you analyze a **specific ZIP code** (without a range).

### How to Use

1. **Go to Direct Analysis Mode**
   - The main analysis interface

2. **Enter NAICS Code(s)**
   - Example: `5413` (Architectural, Engineering, and Related Services)
   - The first code will be used for competitive analysis

3. **Select ZIP Code Location**
   - Choose "ZIP Code" as location type
   - Enter a 5-digit ZIP code (e.g., `90001`)
   - **Important**: Leave ZIP Range blank or unset
   - If you set a ZIP Range, competitive landscape won't run

4. **Set Employee Count** (Optional)
   - Default is 25 employees
   - Adjust to match your company size for better positioning analysis
   - Range: 1-10,000 employees

5. **Click "Run Analysis"**
   - Standard analysis runs (Loan Statistics, Top Banks)
   - **Plus** Competitive Landscape Report appears

## Example Use Cases

### Example 1: Small Professional Services Firm
```
NAICS Code: 5413
Location: ZIP Code 90001 (Los Angeles, CA)
ZIP Range: (blank)
Employee Count: 15
```
**Result**: See how a 15-person architecture firm compares to competitors in Los Angeles

### Example 2: Medium Manufacturing Company
```
NAICS Code: 333
Location: ZIP Code 48226 (Detroit, MI)
ZIP Range: (blank)
Employee Count: 75
```
**Result**: Understand the competitive landscape for a manufacturing company in Detroit

### Example 3: Tech Startup
```
NAICS Code: 5415
Location: ZIP Code 94103 (San Francisco, CA)
ZIP Range: (blank)
Employee Count: 8
```
**Result**: Analyze entry barriers and market concentration for tech services in SF

## What You'll See

When competitive landscape runs, you'll see 8 detailed cards:

### 1. 📍 Location Info
- Market overview
- Total establishments and employees
- Average firm size

### 2. 💼 Company Positioning
- Your size percentile ranking
- How you compare to competitors
- Number of peer companies

### 3. 📊 Market Concentration
- Is the market fragmented or concentrated?
- HHI (Herfindahl-Hirschman Index) score
- Small vs. large firm distribution

### 4. 💰 Entry Barriers
- Labor cost requirements (High/Moderate/Low)
- Average annual compensation
- Typical firm size needed to compete

### 5. 📈 Industry Specificity
- Is this industry concentrated in this area?
- Location quotient
- Regional specialization level

### 6. 👥 Company Size Distribution
- Breakdown by size: Micro, Small, Medium, Large, Very Large
- Visual chart showing distribution
- Where most competitors fall

### 7. 🏢 Geographic Comparison
- County rankings within state
- How this area compares to state average
- Top counties for this industry

### 8. 💵 Payroll Analysis
- Industry compensation benchmarks
- Annual and quarterly pay averages
- Total market payroll

## When It DOESN'T Run

The competitive landscape report will NOT appear if:

❌ **Using State Location**
```
Location: State = CA
```
→ Use ZIP Code instead

❌ **Using ZIP Code with Range**
```
Location: ZIP Code 90001
ZIP Range: 40 miles
```
→ Leave ZIP Range blank or click "Direct ZIP Only"

❌ **No NAICS Code**
```
NAICS Code: (empty)
```
→ Enter at least one NAICS code

❌ **State Not Covered**
The competitive landscape dataset currently covers **22 states**:
```
AK, AL, AR, AZ, CA, CO, CT, DC, DE, FL, GA, HI, IA, ID, IL, IN, KS, KY, LA, MA, MD, ME
```

**Not covered:** MI, MN, MO, MS, MT, NC, ND, NE, NH, NJ, NM, NV, NY, OH, OK, OR, PA, RI, SC, SD, TN, TX, UT, VA, VT, WA, WI, WV, WY

If your state isn't listed, you'll see a helpful error message with the list of covered states.

## Understanding the Data

### Size Percentile
- **90th percentile**: Your company is larger than 90% of competitors
- **50th percentile**: You're right in the middle
- **10th percentile**: Most competitors are larger

### HHI Score (Market Concentration)
- **< 1,500**: Unconcentrated (Competitive market)
- **1,500-2,500**: Moderately concentrated
- **> 2,500**: Highly concentrated (dominated by few firms)

### Location Quotient
- **> 1.2**: High concentration (industry cluster)
- **0.8-1.2**: Average concentration
- **< 0.8**: Below average (not a major hub for this industry)

### Entry Barriers
- **High**: Expensive labor, specialized skills, large firms dominate
- **Moderate**: Some barriers but new entrants possible
- **Low**: Easy to enter, small firms viable

## Tips for Best Results

✅ **Use 4-digit NAICS codes** for more specific industry analysis
- Example: `5413` instead of `54`

✅ **Enter accurate employee count** for better positioning
- Affects your percentile ranking
- Shows where you fit in the market

✅ **Try different ZIP codes** to compare markets
- Run analysis for different locations
- Compare entry barriers and competition

✅ **Check data availability**
- If you see "No data found" error, try a different ZIP/NAICS combination
- Some rural areas may have limited data

## Interpreting Results for Business Decisions

### Market Entry Decision
Look at:
- Entry Barriers (labor costs, firm size requirements)
- Market Concentration (is there room for new players?)
- Size Distribution (can small firms succeed?)

### Competitive Positioning
Look at:
- Your Size Percentile (where you rank)
- Peer Establishments (how many direct competitors)
- Market Share opportunities

### Location Strategy
Look at:
- Location Quotient (is this an industry hub?)
- Geographic Comparison (better counties nearby?)
- County Ranking (is this a strong market?)

### Hiring & Compensation
Look at:
- Average Annual Pay (what to budget for salaries)
- Labor Cost Barrier (can you compete for talent?)
- Payroll Analysis (industry norms)

## Troubleshooting

**Q: I entered a ZIP code but don't see competitive landscape**
- Make sure ZIP Range is blank/unset
- Check that you entered a NAICS code
- Verify the ZIP code is valid (5 digits)

**Q: I see "No data found" error**
- That ZIP/NAICS combination may not have data
- Try a nearby ZIP code
- Try a broader NAICS code (e.g., 54 instead of 5413)

**Q: Employee count isn't changing the results**
- Employee count only affects "Company Positioning" card
- It shows your percentile vs. competitors
- All other data is market-wide, not company-specific

**Q: Can I run competitive landscape for multiple ZIP codes?**
- Currently, one ZIP at a time
- Run separate analyses and compare
- Each run takes only seconds

## Data Sources

The competitive landscape data comes from:
- **County Business Patterns (CBP)** - Establishment and employment data
- **NAICS Industry Classifications** - Industry categorization
- **ZIP-County Mapping** - Geographic linkage
- **Census Data** - FIPS codes and county information

Data is aggregated and anonymized to protect business confidentiality.

## Need Help?

- Check the implementation guide for technical details
- Review example prompts for inspiration
- Use Chat Mode to ask AI for NAICS code recommendations

