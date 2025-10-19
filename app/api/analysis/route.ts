import { NextResponse } from 'next/server';
import { executeGetLoanStatistics, executeGetTopBanks } from '@/lib/ai/tools';
import { getCompetitiveLandscapeByZip, getCompetitiveLandscapeByState } from '@/lib/supabase/functions';
import type { AnalysisRequest, AnalysisResponse, CompetitiveLandscapeData } from '@/lib/types/analysis';

export const maxDuration = 60;

export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    const body: AnalysisRequest = await req.json();

    // Validate request
    if (!body.naicsCodes || body.naicsCodes.length === 0) {
      return NextResponse.json<AnalysisResponse>(
        {
          success: false,
          error: 'NAICS codes are required',
        },
        { status: 400 }
      );
    }

    if (!body.location || !body.location.type || !body.location.value) {
      return NextResponse.json<AnalysisResponse>(
        {
          success: false,
          error: 'Location information is required',
        },
        { status: 400 }
      );
    }

    // Prepare parameters for analysis
    const params = {
      naicsCodes: body.naicsCodes,
      state: body.location.type === 'state' ? String(body.location.value) : undefined,
      zipCode: body.location.type === 'zipCode' ? Number(body.location.value) : undefined,
      zipRange: body.location.zipRange && body.location.zipRange > 0 ? body.location.zipRange : 40,
      topN: body.options?.topN || 3,
    };

    // Check if we should run competitive landscape analysis
    // For ZIP codes: Only when no range specified
    // For States: Always run
    const shouldRunCompetitiveLandscapeZip = 
      body.location.type === 'zipCode' && 
      !body.location.zipRange &&
      body.naicsCodes.length > 0;
    
    const shouldRunCompetitiveLandscapeState =
      body.location.type === 'state' &&
      body.naicsCodes.length > 0;

    // Run main analyses and optionally competitive landscape
    const [loanStatistics, bankResults, competitiveLandscape] = await Promise.all([
      executeGetLoanStatistics(params),
      executeGetTopBanks(params),
      shouldRunCompetitiveLandscapeZip
        ? getCompetitiveLandscapeByZip({
            zipCode: String(body.location.value).padStart(5, '0'),
            naicsCode: String(body.naicsCodes[0]).slice(0, 4), // Use first 4 digits of first NAICS code
            employeeCount: body.options?.employeeCount || 25,
          }).catch((error) => {
            console.error('Competitive landscape (ZIP) error:', error);
            return null; // Don't fail entire request if competitive landscape fails
          })
        : shouldRunCompetitiveLandscapeState
        ? getCompetitiveLandscapeByState({
            stateCode: String(body.location.value),
            naicsCode: String(body.naicsCodes[0]).slice(0, 4), // Use first 4 digits of first NAICS code
            employeeCount: body.options?.employeeCount || 25,
          }).catch((error) => {
            console.error('Competitive landscape (State) error:', error);
            return null; // Don't fail entire request if competitive landscape fails
          })
        : Promise.resolve(null),
    ]);

    const executionTime = Date.now() - startTime;

    const responseData: AnalysisResponse['data'] = {
      loanStatistics,
      bankResults,
    };

    if (competitiveLandscape) {
      responseData.competitiveLandscape = competitiveLandscape as CompetitiveLandscapeData;
    }

    return NextResponse.json<AnalysisResponse>({
      success: true,
      data: responseData,
      metadata: {
        timestamp: new Date().toISOString(),
        naicsCodes: body.naicsCodes,
        location: body.location,
        executionTime,
      },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    
    return NextResponse.json<AnalysisResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while running the analysis',
      },
      { status: 500 }
    );
  }
}

