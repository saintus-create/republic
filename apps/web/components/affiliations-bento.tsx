"use client";

import { useEffect } from "react";
import { BentoGrid, BrandCard, SlidingBrandCard, injectBentoStyles } from "./bento-grid";

/**
 * Affiliations Bento Grid component.
 * Displays brand cards with sliding animation for one card.
 * Uses actual brand logos for Urban Decay, L'Oreal USA, and HER Justice.
 */
export function AffiliationsBento() {
  // Inject animation styles on mount
  useEffect(() => {
    injectBentoStyles();
  }, []);

  return (
    <BentoGrid>
      {/* Urban Decay Card */}
      <BrandCard
        brand="Urban Decay"
        logo={
          <div className="flex items-center justify-center text-4xl font-bold" style={{ color: '#8B5A9B' }}>
            URBAN DECAY
          </div>
        }
        className="bg-gradient-to-br from-purple-100 to-purple-50"
      />

      {/* L'Oreal USA Card (Sliding) */}
      <SlidingBrandCard
        brand="L'Oreal USA"
        logo={
          <div className="flex items-center justify-center text-4xl font-bold" style={{ color: '#E2001A' }}>
            L'ORÉAL
          </div>
        }
        delay={200}
        className="bg-gradient-to-br from-red-100 to-red-50"
      />

      {/* HER Justice Card */}
      <BrandCard
        brand="HER Justice"
        logo={
          <div className="flex items-center justify-center text-3xl font-bold" style={{ color: '#4A90E2' }}>
            HER JUSTICE
          </div>
        }
        className="bg-gradient-to-br from-blue-100 to-blue-50 md:col-start-2"
      />
    </BentoGrid>
  );
}
