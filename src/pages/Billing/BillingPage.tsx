import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import {
  CreditCard,
  Loader2,
  Wallet,
  Database,
  Clock,
  Trash2,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
} from "lucide-react"
import { setUserRefresh } from "../../store/userReducer"
import subscriptionService, { type BillingOverview } from "../../services/subscriptionService"
import AppHeader from "../../components/Layout/AppHeader"

export default function BillingPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [data, setData] = useState<BillingOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCleaning, setIsCleaning] = useState(false)

  const [creditPage, setCreditPage] = useState(1)
  const [creditTotalPages, setCreditTotalPages] = useState(1)
  const [creditTotalCount, setCreditTotalCount] = useState(0)
  const [paginatedHistory, setPaginatedHistory] = useState<BillingOverview["creditHistory"]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const CREDIT_PAGE_SIZE = 10

  const paymentStatus = searchParams.get("status")
  const planName = searchParams.get("plan")
  const creditsGranted = searchParams.get("credits")
  const reason = searchParams.get("reason")

  useEffect(() => {
    if (paymentStatus === "success") {
      toast.success(
        `${planName || "Plan"} activated! ${creditsGranted || ""} credits added.`
      )
      dispatch(setUserRefresh())
    } else if (paymentStatus === "failed") {
      toast.error(`Payment failed: ${reason || "Unknown error"}`)
    }
  }, [paymentStatus, planName, creditsGranted, reason, dispatch])

  useEffect(() => {
    fetchBilling()
  }, [])

  const fetchBilling = async () => {
    try {
      setIsLoading(true)
      const res = await subscriptionService.getBillingOverview()
      setData(res)
    } catch {
      toast.error("Failed to load billing data")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCreditHistory = async (page: number) => {
    try {
      setIsLoadingHistory(true)
      const res = await subscriptionService.getCreditHistory(page, CREDIT_PAGE_SIZE)
      setPaginatedHistory(res.creditHistory)
      setCreditTotalPages(res.totalPages)
      setCreditTotalCount(res.totalCount)
      setCreditPage(res.currentPage)
    } catch {
      toast.error("Failed to load credit history")
    } finally {
      setIsLoadingHistory(false)
    }
  }

  useEffect(() => {
    fetchCreditHistory(creditPage)
  }, [])

  const handleCleanup = async (days: number) => {
    setIsCleaning(true)
    try {
      const res = await subscriptionService.cleanupStorage({ olderThanDays: days })
      toast.success(res.message)
      fetchBilling()
    } catch {
      toast.error("Cleanup failed")
    } finally {
      setIsCleaning(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F2EE] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#F4F2EE] flex items-center justify-center">
        <p className="text-stone-500">Failed to load billing information.</p>
      </div>
    )
  }

  const { subscription, credits, storage, recentPayments } = data
  const plan = subscription.plan
  const isActive = subscription.status === "active"
  const daysLeft = subscription.endDate
    ? Math.max(0, Math.ceil((new Date(subscription.endDate).getTime() - Date.now()) / 86400000))
    : 0

  return (
    <div className="min-h-screen bg-[#F4F2EE] flex flex-col">
      <AppHeader title="Billing & Subscription" onLogout={handleLogout} />

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Payment status banner */}
        {paymentStatus === "success" && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-900">Payment Successful</p>
              <p className="text-xs text-emerald-700">
                {planName} plan activated with {creditsGranted} credits.
              </p>
            </div>
          </div>
        )}
        {paymentStatus === "failed" && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
            <XCircle className="h-5 w-5 text-red-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-900">Payment Failed</p>
              <p className="text-xs text-red-700">{reason || "Please try again."}</p>
            </div>
          </div>
        )}

        {/* Top cards row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Subscription card */}
          <div className="bg-white rounded-2xl border border-[#E5E2DA] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-violet-500" />
                Subscription
              </h3>
              {isActive ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  Active
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                  {subscription.status || "None"}
                </span>
              )}
            </div>
            {plan ? (
              <>
                <div className="text-2xl font-bold text-stone-900">{plan.displayName}</div>
                <p className="text-xs text-stone-500">
                  {isActive ? `${daysLeft} days remaining` : "Expired"}
                </p>
                <p className="text-[10px] text-stone-400">
                  {subscription.startDate && new Date(subscription.startDate).toLocaleDateString()} —{" "}
                  {subscription.endDate && new Date(subscription.endDate).toLocaleDateString()}
                </p>
              </>
            ) : (
              <div>
                <p className="text-sm text-stone-500">No active plan</p>
                <button
                  onClick={() => navigate("/pricing")}
                  className="mt-2 text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
                >
                  View Plans <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
            )}
            {plan && (
              <button
                onClick={() => navigate("/pricing")}
                className="w-full mt-1 text-xs font-semibold text-center py-2 rounded-lg border border-violet-200 text-violet-600 hover:bg-violet-50 transition"
              >
                {isActive ? "Upgrade Plan" : "Renew"}
              </button>
            )}
          </div>

          {/* Credits card */}
          <div className="bg-white rounded-2xl border border-[#E5E2DA] p-5 space-y-3">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Wallet className="h-4 w-4 text-blue-500" />
              Credits
            </h3>
            <div className="text-3xl font-bold text-stone-900">{credits}</div>
            <p className="text-xs text-stone-500">Available credits</p>
            {plan && (
              <p className="text-[10px] text-stone-400">
                Regenerations per image: {plan.features.regenerationsPerImage} (no free regen for 4K)
              </p>
            )}
          </div>

          {/* Storage card */}
          <div className="bg-white rounded-2xl border border-[#E5E2DA] p-5 space-y-3">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Database className="h-4 w-4 text-emerald-500" />
              Storage
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-stone-900">{storage.galleryCount}</span>
              <span className="text-sm text-stone-400">/ {storage.maxGalleryImages}</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  storage.usagePercent > 90 ? "bg-red-500" : storage.usagePercent > 70 ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(storage.usagePercent, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-stone-400">
                <Clock className="inline h-3 w-3 mr-0.5" />
                Auto-cleanup after {storage.dataRetentionDays} days
              </p>
              {storage.usagePercent > 80 && (
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              )}
            </div>
            <button
              onClick={() => handleCleanup(storage.dataRetentionDays)}
              disabled={isCleaning}
              className="w-full text-xs font-semibold text-center py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition flex items-center justify-center gap-1.5"
            >
              {isCleaning ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
              Clean Up Old Files
            </button>
          </div>
        </div>

        {/* Credit History */}
        <div className="bg-white rounded-2xl border border-[#E5E2DA] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#E5E2DA] flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900">
              Credit Usage History
              {creditTotalCount > 0 && (
                <span className="ml-2 text-[10px] font-normal text-stone-400">({creditTotalCount} total)</span>
              )}
            </h3>
            <button
              onClick={() => fetchCreditHistory(creditPage)}
              disabled={isLoadingHistory}
              className="p-1 hover:bg-stone-50 rounded"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-stone-400 ${isLoadingHistory ? "animate-spin" : ""}`} />
            </button>
          </div>

          {isLoadingHistory && paginatedHistory.length === 0 ? (
            <div className="px-5 py-10 flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-stone-400" />
            </div>
          ) : paginatedHistory.length > 0 ? (
            <>
              <div className={`divide-y divide-[#F0EEEA] ${isLoadingHistory ? "opacity-50" : ""}`}>
                {paginatedHistory.map((entry, i) => (
                  <div key={`${creditPage}-${i}`} className="px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          entry.type === "grant"
                            ? "bg-emerald-500"
                            : entry.type === "usage"
                            ? "bg-red-400"
                            : "bg-blue-400"
                        }`}
                      />
                      <div>
                        <p className="text-xs font-medium text-stone-900">{entry.reason || entry.type}</p>
                        <p className="text-[10px] text-stone-400">
                          {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-bold ${
                          entry.amount > 0 ? "text-emerald-600" : "text-red-500"
                        }`}
                      >
                        {entry.amount > 0 ? "+" : ""}
                        {entry.amount}
                      </p>
                      <p className="text-[10px] text-stone-400">Balance: {entry.balance}</p>
                    </div>
                  </div>
                ))}
              </div>

              {creditTotalPages > 1 && (
                <div className="px-5 py-3 border-t border-[#E5E2DA] flex items-center justify-between">
                  <p className="text-[10px] text-stone-400">
                    Page {creditPage} of {creditTotalPages}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => fetchCreditHistory(creditPage - 1)}
                      disabled={creditPage <= 1 || isLoadingHistory}
                      className="p-1.5 rounded-lg border border-[#E5E2DA] hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft className="h-3.5 w-3.5 text-stone-600" />
                    </button>
                    {Array.from({ length: creditTotalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === creditTotalPages || Math.abs(p - creditPage) <= 1)
                      .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                        if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...")
                        acc.push(p)
                        return acc
                      }, [])
                      .map((item, idx) =>
                        item === "..." ? (
                          <span key={`ellipsis-${idx}`} className="px-1 text-[10px] text-stone-400">
                            ...
                          </span>
                        ) : (
                          <button
                            key={item}
                            onClick={() => fetchCreditHistory(item as number)}
                            disabled={isLoadingHistory}
                            className={`min-w-[28px] h-7 text-xs font-medium rounded-lg border transition ${
                              item === creditPage
                                ? "bg-stone-900 text-white border-stone-900"
                                : "border-[#E5E2DA] text-stone-600 hover:bg-stone-50"
                            } disabled:cursor-not-allowed`}
                          >
                            {item}
                          </button>
                        )
                      )}
                    <button
                      onClick={() => fetchCreditHistory(creditPage + 1)}
                      disabled={creditPage >= creditTotalPages || isLoadingHistory}
                      className="p-1.5 rounded-lg border border-[#E5E2DA] hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ChevronRight className="h-3.5 w-3.5 text-stone-600" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="px-5 py-10 text-center text-sm text-stone-400">No credit history yet.</div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-2xl border border-[#E5E2DA] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#E5E2DA] flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900">Payment History</h3>
            <button
              onClick={() => navigate("/pricing")}
              className="text-xs text-violet-600 font-semibold flex items-center gap-0.5 hover:text-violet-700"
            >
              View Plans <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          {recentPayments.length > 0 ? (
            <div className="divide-y divide-[#F0EEEA]">
              {recentPayments.map((payment) => (
                <div key={payment._id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-stone-900">
                      {payment.planId?.displayName || "Plan"} — {payment.creditsGranted} credits
                    </p>
                    <p className="text-[10px] text-stone-400">
                      {new Date(payment.createdAt).toLocaleDateString()} · {payment.provider}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-stone-900">
                      {payment.currency === "INR" ? "₹" : "$"}
                      {payment.amount}
                    </p>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        payment.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : payment.status === "failed"
                          ? "bg-red-100 text-red-600"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-10 text-center text-sm text-stone-400">
              No payments yet.{" "}
              <button onClick={() => navigate("/pricing")} className="text-violet-600 font-semibold">
                Get started
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
