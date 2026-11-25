"use client";

import React, { useEffect, useRef, useState } from "react";
import { Bot, Check, ChevronDown, Feather, Fish, Layers } from "lucide-react";
import { FisheriesBatch } from "@/types/fisheries";
import { PoultryBatch } from "@/data/defaultPoultryData";
import { AiContent } from "@/i18n/aiTranslations";

export interface BatchContextPayload {
  batchId: string;
  batchName: string;
  domain: "fisheries" | "poultry";
  speciesOrBreed: string;
  ageDays: number;
  currentCount: number;
  avgWeightGrams: number;
  latestFeedKg: number;
  fcr: number;
  mortalityCount: number;
  latestWaterQuality?: {
    temperatureC: number;
    pH: number;
    dissolvedOxygenMgL: number;
    ammoniaMgL: number;
    lastUpdated: string;
  };
  shedEnvironment?: {
    temperatureC: number;
    humidityPercent: number;
    vaccinationStatus: string;
  };
  pendingTasks: string[];
}

interface ChatContextSelectorsProps {
  selectedDomain: "fisheries" | "poultry";
  selectedMode: "general" | "batch";
  selectedBatchId: string;
  fisheriesBatches: FisheriesBatch[];
  poultryBatches: PoultryBatch[];
  batchContext: BatchContextPayload | null;
  labels: AiContent["selectors"];
  onDomainChange: (domain: "fisheries" | "poultry") => void;
  onModeChange: (mode: "general" | "batch") => void;
  onBatchSelect: (batchId: string) => void;
}

type OpenMenu = "domain" | "mode" | "batch" | null;

export function ChatContextSelectors({
  selectedDomain,
  selectedMode,
  selectedBatchId,
  fisheriesBatches,
  poultryBatches,
  batchContext,
  labels,
  onDomainChange,
  onModeChange,
  onBatchSelect,
}: ChatContextSelectorsProps) {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(null);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelectDomain = (domain: "fisheries" | "poultry") => {
    onDomainChange(domain);
    // Auto-cascade: when switching domain in Batch AI mode, open Batch Selector immediately
    if (selectedMode === "batch") {
      setOpenMenu("batch");
    } else {
      setOpenMenu(null);
    }
  };

  const handleSelectMode = (mode: "general" | "batch") => {
    onModeChange(mode);
    if (mode === "batch" && !selectedBatchId) {
      setOpenMenu("batch");
    } else {
      setOpenMenu(null);
    }
  };

  const handleSelectBatch = (batchId: string) => {
    onBatchSelect(batchId);
    setOpenMenu(null);
  };

  const activeFishBatch = fisheriesBatches.find((b) => b.id === selectedBatchId);
  const activePoultryBatch = poultryBatches.find((b) => b.id === selectedBatchId);

  const selectedBatchLabel =
    selectedDomain === "fisheries"
      ? activeFishBatch?.name || labels.selectBatch
      : activePoultryBatch?.name || labels.selectBatch;

  const hasLinkedBatch =
    selectedMode === "batch" && Boolean(selectedBatchId) && Boolean(batchContext);

  const linkedTooltipText = batchContext
    ? batchContext.domain === "fisheries"
      ? `${labels.batchActiveBadge}: ${batchContext.currentCount.toLocaleString()} ${labels.fishCountUnit} · ${Math.round(batchContext.avgWeightGrams)}g avg · DO ${batchContext.latestWaterQuality?.dissolvedOxygenMgL ?? "-"} mg/L · Feed ${batchContext.latestFeedKg} kg`
      : `${labels.batchActiveBadge}: ${batchContext.currentCount.toLocaleString()} ${labels.birdCountUnit} · ${labels.dayPrefix} ${batchContext.ageDays} · ${Math.round(batchContext.avgWeightGrams)}g · FCR ${batchContext.fcr}`
    : undefined;

  const triggerClass =
    "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100/90 hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 whitespace-nowrap";

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap items-center gap-1 sm:gap-1.5 pt-2"
    >
      {/* 1. Farm Domain Selector */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenMenu(openMenu === "domain" ? null : "domain")}
          aria-expanded={openMenu === "domain"}
          aria-haspopup="listbox"
          className={triggerClass}
        >
          {selectedDomain === "fisheries" ? (
            <Fish className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          ) : (
            <Feather className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          )}
          <span>
            {selectedDomain === "fisheries" ? labels.fisheries : labels.poultry}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
              openMenu === "domain" ? "rotate-180" : ""
            }`}
          />
        </button>

        {openMenu === "domain" && (
          <div
            role="listbox"
            className="absolute bottom-full left-0 mb-2 w-52 rounded-xl border border-slate-200 bg-white shadow-lg p-1.5 z-50"
          >
            <button
              type="button"
              onClick={() => handleSelectDomain("fisheries")}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs sm:text-sm transition-colors ${
                selectedDomain === "fisheries"
                  ? "bg-emerald-50 text-[#0F5132] font-semibold"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span className="flex items-center gap-2">
                <Fish className="w-4 h-4 text-emerald-700" />
                <span>{labels.fisheries}</span>
              </span>
              {selectedDomain === "fisheries" && (
                <Check className="w-3.5 h-3.5 text-emerald-700" />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleSelectDomain("poultry")}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs sm:text-sm transition-colors ${
                selectedDomain === "poultry"
                  ? "bg-emerald-50 text-[#0F5132] font-semibold"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span className="flex items-center gap-2">
                <Feather className="w-4 h-4 text-emerald-700" />
                <span>{labels.poultry}</span>
              </span>
              {selectedDomain === "poultry" && (
                <Check className="w-3.5 h-3.5 text-emerald-700" />
              )}
            </button>
          </div>
        )}
      </div>

      <span className="text-slate-300 text-xs select-none">/</span>

      {/* 2. AI Mode Selector */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenMenu(openMenu === "mode" ? null : "mode")}
          aria-expanded={openMenu === "mode"}
          aria-haspopup="listbox"
          className={triggerClass}
        >
          {selectedMode === "general" ? (
            <Bot className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          ) : (
            <Layers className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          )}
          <span>
            {selectedMode === "general" ? labels.generalAi : labels.batchAi}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
              openMenu === "mode" ? "rotate-180" : ""
            }`}
          />
        </button>

        {openMenu === "mode" && (
          <div
            role="listbox"
            className="absolute bottom-full left-0 mb-2 w-64 rounded-xl border border-slate-200 bg-white shadow-lg p-1.5 z-50"
          >
            <button
              type="button"
              onClick={() => handleSelectMode("general")}
              className={`w-full flex items-start justify-between gap-2 px-2.5 py-2 rounded-lg text-left transition-colors ${
                selectedMode === "general"
                  ? "bg-emerald-50 text-[#0F5132]"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-start gap-2">
                <Bot className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs sm:text-sm font-semibold">
                    {labels.generalAi}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {labels.generalAiDesc}
                  </div>
                </div>
              </div>
              {selectedMode === "general" && (
                <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSelectMode("batch")}
              className={`w-full flex items-start justify-between gap-2 px-2.5 py-2 rounded-lg text-left transition-colors ${
                selectedMode === "batch"
                  ? "bg-emerald-50 text-[#0F5132]"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-start gap-2">
                <Layers className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs sm:text-sm font-semibold">
                    {labels.batchAi}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {labels.batchAiDesc}
                  </div>
                </div>
              </div>
              {selectedMode === "batch" && (
                <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* 3. Batch Selector (Visible when Batch AI is active) */}
      {selectedMode === "batch" && (
        <>
          <span className="text-slate-300 text-xs select-none">/</span>
          <div className="relative max-w-full">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === "batch" ? null : "batch")}
              aria-expanded={openMenu === "batch"}
              aria-haspopup="listbox"
              title={linkedTooltipText}
              className={`${triggerClass} max-w-[230px] sm:max-w-[300px]`}
            >
              {hasLinkedBatch && (
                <span
                  className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"
                  aria-label={labels.batchActiveBadge}
                />
              )}
              <span className="truncate">{selectedBatchLabel}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${
                  openMenu === "batch" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openMenu === "batch" && (
              <div
                role="listbox"
                className="absolute bottom-full left-0 mb-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg p-1.5 z-50"
              >
                {selectedDomain === "fisheries" ? (
                  fisheriesBatches.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-slate-500">
                      {labels.noBatches}
                    </div>
                  ) : (
                    fisheriesBatches.map((b) => {
                      const totalFish = b.speciesList.reduce(
                        (sum, s) => sum + s.quantity,
                        0
                      );
                      const speciesSummary = b.speciesList
                        .map((s) => s.speciesName)
                        .join(", ");
                      const isSelected = b.id === selectedBatchId;

                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => handleSelectBatch(b.id)}
                          className={`w-full flex items-start justify-between gap-2 px-2.5 py-2 rounded-lg text-left transition-colors ${
                            isSelected
                              ? "bg-emerald-50 text-[#0F5132]"
                              : "text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-semibold truncate">
                              {b.name}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">
                              {speciesSummary} · {totalFish.toLocaleString()}{" "}
                              {labels.fishCountUnit}
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })
                  )
                ) : poultryBatches.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-slate-500">
                    {labels.noBatches}
                  </div>
                ) : (
                  poultryBatches.map((p) => {
                    const isSelected = p.id === selectedBatchId;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectBatch(p.id)}
                        className={`w-full flex items-start justify-between gap-2 px-2.5 py-2 rounded-lg text-left transition-colors ${
                          isSelected
                            ? "bg-emerald-50 text-[#0F5132]"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-semibold truncate">
                            {p.name}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {p.breed} ({p.category}) · {labels.dayPrefix}{" "}
                            {p.ageDays} · {p.quantity.toLocaleString()}{" "}
                            {labels.birdCountUnit}
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
