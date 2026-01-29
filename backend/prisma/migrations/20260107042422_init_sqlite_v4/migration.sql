-- CreateTable
CREATE TABLE "AgentInteraction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "messageType" TEXT NOT NULL,
    "userResponse" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "converted" BOOLEAN NOT NULL,
    "responseTime" INTEGER NOT NULL,
    "engagementScore" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AgentPerformance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "engagementRate" REAL NOT NULL,
    "conversionRate" REAL NOT NULL,
    "responseTime" REAL NOT NULL,
    "accuracyScore" REAL NOT NULL,
    "improvementTrend" TEXT NOT NULL,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AgentPattern" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "sentimentDistribution" TEXT NOT NULL,
    "bestMessageType" TEXT NOT NULL,
    "bestConversionRate" REAL NOT NULL,
    "messageTypePatterns" TEXT NOT NULL,
    "analysisDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "StrategyAdjustment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "adjustment" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "parameters" TEXT NOT NULL,
    "appliedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "AgentPerformance_agentId_platform_key" ON "AgentPerformance"("agentId", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "AgentPattern_agentId_platform_key" ON "AgentPattern"("agentId", "platform");
