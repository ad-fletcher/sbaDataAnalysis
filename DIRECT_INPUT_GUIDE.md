# Direct Input Mode - User Guide

## Overview

The AI Financial Analyst now features **two powerful modes** for analyzing SBA loan data:

1. **Direct Input Mode** - Fast, structured input for when you know exactly what you want
2. **Chat Mode** - Conversational AI that guides you through the analysis

## Getting Started

### Switching Between Modes

At the top of the page, you'll see a toggle button:
- **Direct Input** - For quick, structured queries
- **Chat Mode** - For guided, conversational analysis

Your mode preference is saved automatically.

---

## Direct Input Mode

### When to Use Direct Input Mode

Use Direct Input Mode when you:
- Already know the NAICS codes you want to analyze
- Want the fastest possible results
- Prefer structured forms over conversation
- Need to quickly compare different regions or industries

### How to Use

#### 1. Enter NAICS Codes

**Single Code:**
```
331110
```

**Multiple Codes:**
```
331110, 332312, 423510
```

**Features:**
- Add up to 6 NAICS codes
- Codes appear as removable tags
- Click the info icon (ℹ️) to see quick presets
- Paste multiple codes separated by commas, spaces, or line breaks

**Quick Presets Available:**
- Steel Manufacturing
- Restaurants
- Retail
- Construction
- Healthcare
- Technology
- Manufacturing
- Professional Services

#### 2. Select Location

**Option A: State Analysis**
- Select any US state from the dropdown
- Analyzes all loans across the entire state
- Best for: Statewide market research

**Option B: Zip Code Analysis**
- Enter a 5-digit zip code
- Adjust the search radius (10-100 miles)
- Best for: Local market analysis

**Important:** State and Zip Code are mutually exclusive. Choose one.

#### 3. Analysis Options

**Top Banks to Display:**
- Slider from 1 to 10 banks
- Default: 3 banks
- Shows the most active lenders in your selected area

#### 4. Run Analysis

Click the large **"Run Analysis"** button to:
- Fetch loan statistics
- Calculate default rates and risk premiums
- Identify top lenders by processing method
- Display comprehensive results

### Understanding the Results

#### Loan Statistics Cards

**1. Market & Default Rates**
- **Sold Before 2020:** Percentage of loans originated before COVID
- **Pre-COVID Default:** Historical default rate
- **Recent 3yr Default:** Current default performance
- **Avg Months to PIF:** Average time to Paid In Full
- **Avg Months to Chgoff:** Average time to charge-off

**2. Risk Premium**
- Statistical distribution of interest rate premiums
- P25, Median, P75, Mean values
- Visual distribution bar
- Higher values indicate higher perceived risk

**3. Jobs Supported**
- Number of jobs created/supported per loan
- Key metric for economic impact
- Shows employment intensity of industry

**4. Inflation-Adjusted Loan Amount**
- All amounts adjusted to 2025 dollars
- Real purchasing power comparison
- Percentile distributions

#### Top Banks Cards

**Overall Top Banks:**
- Ranked by total loan volume
- Shows bank name and loan count

**Banks by Processing Method:**
- Separate rankings for different loan types
- Full bank addresses included
- Processing method indicates loan guaranty type

---

## Chat Mode

### When to Use Chat Mode

Use Chat Mode when you:
- Don't know the NAICS codes
- Want guidance on what to analyze
- Need help interpreting results
- Prefer conversational interaction

### Example Queries

```
"Show me steel companies in Texas"
"Analyze restaurants in San Francisco"
"What are the top banks for construction loans in zip code 90210?"
"Compare manufacturing companies in California vs. Texas"
```

### Chat Flow

1. **Describe your business/industry**
2. **AI finds relevant NAICS codes**
3. **Specify location (state or zip)**
4. **AI confirms and runs analysis**
5. **Results displayed with explanations**

---

## Tips & Best Practices

### Direct Input Mode Tips

1. **Use Multiple Related Codes**
   - Capture full industry segment
   - Example for steel: 331110 (mills), 332312 (fabrication), 423510 (distribution)

2. **State vs. Zip Code**
   - State: Better for market overview
   - Zip Code: Better for local competition analysis

3. **Adjust Zip Range Strategically**
   - Urban areas: 10-20 miles
   - Suburban: 30-50 miles
   - Rural: 50-100 miles

4. **Top Banks Setting**
   - 3 banks: Quick overview
   - 5-10 banks: Comprehensive lender mapping

### Chat Mode Tips

1. **Be Specific About Location**
   - Good: "steel companies in Houston, TX"
   - Better: "steel companies in zip code 77002"

2. **Mention Industry Segment**
   - "Steel mills" vs. "Steel fabrication" vs. "Steel distribution"
   - AI will find more precise NAICS codes

3. **Follow Up Questions**
   - "Show me just Houston"
   - "Compare with Dallas"
   - "Which banks offer the best terms?"

---

## Common NAICS Codes

### Manufacturing
- 331110 - Iron and Steel Mills
- 332312 - Fabricated Structural Metal
- 333111 - Farm Machinery & Equipment
- 334111 - Electronic Computer Manufacturing

### Restaurants & Food Service
- 722511 - Full-Service Restaurants
- 722513 - Limited-Service Restaurants
- 722514 - Cafeterias & Buffets

### Retail
- 445110 - Supermarkets
- 446110 - Pharmacies
- 448140 - Family Clothing Stores

### Construction
- 236115 - New Single-Family Housing
- 236116 - New Multifamily Housing
- 238110 - Poured Concrete Foundation

### Healthcare
- 621111 - Offices of Physicians
- 621210 - Offices of Dentists
- 623110 - Nursing Care Facilities

### Professional Services
- 541110 - Legal Services
- 541211 - CPA Services
- 541330 - Engineering Services
- 541511 - Custom Computer Programming

---

## Troubleshooting

### "Please enter at least one NAICS code"
- Add 2-6 digit NAICS code(s) before running analysis

### "Please select a state"
- Choose a state from the dropdown menu

### "Please enter a valid 5-digit zip code"
- Ensure zip code is exactly 5 digits
- Example: 90210, not 90210-1234

### "No data returned"
- Try broader NAICS codes (fewer digits)
- Increase zip code range
- Try state-level analysis instead

### Slow Results
- Normal for large datasets
- State-level queries take longer than zip code
- Multiple NAICS codes increase processing time

---

## Keyboard Shortcuts

### Direct Input Mode
- **Enter** - Add NAICS code
- **Backspace** (empty field) - Remove last code
- **Tab** - Navigate between fields

---

## Data Refresh

- All data is queried in real-time from the database
- Results include timestamp
- No caching - always current data

---

## Privacy & Storage

### What's Stored Locally
- Mode preference (Direct vs. Chat)
- That's it!

### What's NOT Stored
- NAICS codes
- Search history
- Analysis results
- Personal information

---

## Performance

### Expected Response Times

| Query Type | Expected Time |
|------------|--------------|
| Single NAICS, Zip Code | 1-2 seconds |
| Multiple NAICS, Zip Code | 2-3 seconds |
| Single NAICS, State | 2-4 seconds |
| Multiple NAICS, State | 3-5 seconds |

Slower queries may indicate:
- High database load
- Complex NAICS combinations
- Large geographic areas

---

## Mobile Usage

The interface is fully responsive:
- Touch-friendly tap targets
- Collapsible sections
- Optimized layouts for small screens
- Swipe-friendly scrolling

---

## Accessibility

Features include:
- Keyboard navigation
- Screen reader support
- ARIA labels on all inputs
- High contrast mode support
- Focus indicators

---

## Need Help?

### Finding NAICS Codes
1. Click the info icon (ℹ️) in Direct Input Mode
2. Use Chat Mode to describe your industry
3. Visit: https://www.census.gov/naics/

### Interpreting Results
- Switch to Chat Mode for explanations
- Ask follow-up questions
- Compare multiple analyses

### Technical Issues
- Refresh the page
- Clear browser cache
- Try a different browser
- Check internet connection

---

## What's Next?

Planned features:
- [ ] Export results to CSV/PDF
- [ ] Save favorite NAICS combinations
- [ ] Analysis history
- [ ] Comparison mode
- [ ] Bulk code upload
- [ ] Custom date ranges

---

## Examples

### Example 1: Local Restaurant Analysis

**Objective:** Find top SBA lenders for restaurants in downtown Austin

**Direct Input Mode:**
1. NAICS Codes: `722511, 722513`
2. Location: Zip Code `78701`, Range: 5 miles
3. Top Banks: 5
4. Click "Run Analysis"

**Results Show:**
- Default rates for Austin restaurants
- Average loan amounts (inflation-adjusted)
- Jobs supported per restaurant
- Top 5 banks active in downtown Austin

### Example 2: Statewide Manufacturing Research

**Objective:** Analyze steel manufacturing across Texas

**Direct Input Mode:**
1. NAICS Codes: `331110, 331210, 332312`
2. Location: State `TX`
3. Top Banks: 3
4. Click "Run Analysis"

**Results Show:**
- Texas steel industry loan performance
- Risk premiums for different segments
- Statewide lending patterns
- Major banks supporting steel industry

### Example 3: Healthcare Comparison

**Chat Mode:**
```
You: "Compare medical practices in Dallas vs Houston"

AI: "I'll help analyze medical practices. 
Are you interested in:
- Physician offices (621111)
- Dental offices (621210)
- Or both?"

You: "Both"

AI: "Great! Would you like statewide Texas data, 
or specific zip codes for Dallas and Houston?"

You: "Zip codes - 75201 for Dallas and 77002 for Houston"

AI: [Runs analysis for both locations]
```

---

**Version:** 1.0  
**Last Updated:** October 2025  
**Feedback:** Use Chat Mode to share feedback and suggestions!

