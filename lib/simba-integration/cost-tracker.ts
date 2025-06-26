export interface VerificationCost {
  transactionId: string
  dataId: string
  dataType: string
  timestamp: string
  cost: number
  batchSize?: number
}

export class CostTracker {
  private costs: VerificationCost[] = []
  private readonly storageKey = "simba-verification-costs"

  constructor() {
    this.loadCosts()
  }

  /**
   * Loads costs from storage
   */
  private loadCosts(): void {
    if (typeof window === "undefined") return

    try {
      const storedCosts = localStorage.getItem(this.storageKey)
      if (storedCosts) {
        this.costs = JSON.parse(storedCosts)
      }
    } catch (error) {
      console.error("Failed to load costs from storage:", error)
      this.costs = []
    }
  }

  /**
   * Saves costs to storage
   */
  private saveCosts(): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.costs))
    } catch (error) {
      console.error("Failed to save costs to storage:", error)
    }
  }

  /**
   * Tracks a verification cost
   */
  trackCost(cost: VerificationCost): void {
    this.costs.push(cost)
    this.saveCosts()
  }

  /**
   * Gets total cost for a time period
   */
  getTotalCost(startDate?: Date, endDate?: Date): number {
    let filteredCosts = this.costs

    if (startDate) {
      filteredCosts = filteredCosts.filter((cost) => new Date(cost.timestamp) >= startDate)
    }

    if (endDate) {
      filteredCosts = filteredCosts.filter((cost) => new Date(cost.timestamp) <= endDate)
    }

    return filteredCosts.reduce((total, cost) => total + cost.cost, 0)
  }

  /**
   * Gets costs grouped by data type
   */
  getCostsByType(startDate?: Date, endDate?: Date): Record<string, number> {
    let filteredCosts = this.costs

    if (startDate) {
      filteredCosts = filteredCosts.filter((cost) => new Date(cost.timestamp) >= startDate)
    }

    if (endDate) {
      filteredCosts = filteredCosts.filter((cost) => new Date(cost.timestamp) <= endDate)
    }

    return filteredCosts.reduce(
      (result, cost) => {
        const { dataType } = cost
        result[dataType] = (result[dataType] || 0) + cost.cost
        return result
      },
      {} as Record<string, number>,
    )
  }

  /**
   * Gets cost savings from batching
   */
  getBatchingSavings(): number {
    const batchedCosts = this.costs.filter((cost) => cost.batchSize && cost.batchSize > 1)

    // Calculate what the cost would have been without batching
    const potentialCost = batchedCosts.reduce((total, cost) => {
      // Assume individual verification costs are the same as the per-item cost in the batch
      const individualCost = cost.cost / (cost.batchSize || 1)
      return total + individualCost * (cost.batchSize || 1)
    }, 0)

    // Calculate actual cost with batching
    const actualCost = batchedCosts.reduce((total, cost) => total + cost.cost, 0)

    return potentialCost - actualCost
  }

  /**
   * Clears all tracked costs
   */
  clearCosts(): void {
    this.costs = []
    this.saveCosts()
  }
}
