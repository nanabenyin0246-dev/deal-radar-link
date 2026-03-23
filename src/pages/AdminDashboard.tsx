import { useState } from "react";
import { sendEmail, emailTemplates } from "@/utils/sendEmail";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin, useAdminOrders, useAdminDisputes, useAdminVendors, useUpdateVendorStatus, useResolveDispute, useAdminCommissions, useAdminAuditLog, useToggleFraudFlag, useAdminSubmissions, useApproveSubmission, useRejectSubmission } from "@/hooks/useAdmin";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Shield, Package, AlertTriangle, Users, DollarSign, FileText, Download, Flag, BarChart3, Inbox, CheckCircle, XCircle } from "lucide-react";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import MilestoneProgress from "@/components/admin/MilestoneProgress";

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: orders } = useAdminOrders();
  const { data: disputes } = useAdminDisputes();
  const { data: vendors } = useAdminVendors();
  const { data: commissions } = useAdminCommissions();
  const { data: auditLog } = useAdminAuditLog();
  const updateVendorStatus = useUpdateVendorStatus();
  const resolveDispute = useResolveDispute();
  const toggleFraudFlag = useToggleFraudFlag();
  const { data: submissions } = useAdminSubmissions();
  const approveSubmission = useApproveSubmission();
  const rejectSubmission = useRejectSubmission();
  const { toast } = useToast();

  if (authLoading || adminLoading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  if (!user || !isAdmin) return <Navigate to="/" />;

  const exportCSV = (data: any[], filename: string) => {
    if (!data?.length) return;
    const headers = Object.keys(data[0]).filter(k => typeof data[0][k] !== "object");
    const csv = [headers.join(","), ...data.map(row => headers.map(h => JSON.stringify(row[h] ?? "")).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${filename}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const totalCommission = commissions?.reduce((s, c) => s + Number(c.commission_amount || 0), 0) || 0;
  const openDisputes = disputes?.filter(d => !["closed", "resolved_buyer", "resolved_vendor", "resolved_split"].includes(d.status))?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 max-w-6xl">
        <h1 className="font-heading text-2xl font-bold flex items-center gap-2 mb-6">
          <Shield className="w-6 h-6 text-primary" /> Admin Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Package, label: "Orders", value: orders?.length || 0 },
            { icon: AlertTriangle, label: "Open Disputes", value: openDisputes, alert: openDisputes > 0 },
            { icon: Users, label: "Vendors", value: vendors?.length || 0 },
            { icon: DollarSign, label: "Commission (GHS)", value: totalCommission.toLocaleString() },
          ].map(s => (
            <div key={s.label} className={`bg-card border rounded-xl p-4 text-center ${s.alert ? "border-destructive" : "border-border"}`}>
              <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.alert ? "text-destructive" : "text-muted-foreground"}`} />
              <div className="font-heading text-xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <MilestoneProgress />

        <Tabs defaultValue="analytics">
          <TabsList className="mb-4 flex-wrap">
            <TabsTrigger value="analytics"><BarChart3 className="w-3 h-3 mr-1" />Analytics</TabsTrigger>
            <TabsTrigger value="submissions"><Inbox className="w-3 h-3 mr-1" />Submissions{submissions?.filter((s: any) => s.status === "pending").length ? ` (${submissions.filter((s: any) => s.status === "pending").length})` : ""}</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="disputes">Disputes</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions">
            <div className="space-y-3">
              {submissions?.map((sub: any) => (
                <div key={sub.id} className={`bg-card border rounded-xl p-4 ${sub.status === "pending" ? "border-secondary/50" : "border-border"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold">{sub.name}</p>
                      <p className="text-sm text-muted-foreground">{sub.brand} {sub.category ? `· ${sub.category}` : ""}</p>
                      {sub.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{sub.description}</p>}
                      <p className="text-xs text-muted-foreground mt-2">
                        Vendor: {(sub.vendor as any)?.business_name} · {new Date(sub.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={sub.status === "pending" ? "outline" : sub.status === "approved" ? "default" : "destructive"}>{sub.status}</Badge>
                      {sub.status === "pending" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => {
                            approveSubmission.mutate({ submission: sub });
                            toast({ title: "Product approved and added" });
                          }}>
                            <CheckCircle className="w-3 h-3" /> Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => {
                            rejectSubmission.mutate({ submissionId: sub.id });
                            toast({ title: "Submission rejected" });
                          }}>
                            <XCircle className="w-3 h-3" /> Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {!submissions?.length && <p className="text-center py-8 text-muted-foreground">No product submissions yet</p>}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="flex justify-end mb-3">
              <Button variant="outline" size="sm" onClick={() => exportCSV(orders || [], "orders")}>
                <Download className="w-3 h-3" /> Export CSV
              </Button>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Product</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Amount</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Method</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                  </tr></thead>
                  <tbody>
                    {orders?.map(o => (
                      <tr key={o.id} className="border-b border-border last:border-0">
                        <td className="p-3">{(o.product as any)?.name}</td>
                        <td className="p-3 font-heading font-bold">{o.currency} {Number(o.total_price).toLocaleString()}</td>
                        <td className="p-3"><Badge variant="outline">{o.status}</Badge></td>
                        <td className="p-3 text-muted-foreground">{o.payment_method || "—"}</td>
                        <td className="p-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!orders?.length && <p className="text-center py-8 text-muted-foreground">No orders yet</p>}
            </div>
          </TabsContent>

          {/* Disputes Tab */}
          <TabsContent value="disputes">
            <div className="space-y-3">
              {disputes?.map(d => (
                <div key={d.id} className={`bg-card border rounded-xl p-4 ${d.status === "open" ? "border-destructive/50" : "border-border"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-heading font-semibold">{d.reason}</p>
                      <p className="text-sm text-muted-foreground mt-1">{d.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Order: {(d.order as any)?.product?.name} · {(d.order as any)?.currency} {Number((d.order as any)?.total_price).toLocaleString()}
                      </p>
                      {d.vendor_response && <p className="text-sm mt-2"><strong>Vendor:</strong> {d.vendor_response}</p>}
                      {d.admin_decision && <p className="text-sm mt-1"><strong>Decision:</strong> {d.admin_decision}</p>}
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Badge variant={d.status === "open" ? "destructive" : "outline"}>{d.status}</Badge>
                      {!d.resolved_at && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => {
                            resolveDispute.mutate({ disputeId: d.id, decision: "Refund to buyer", status: "resolved_buyer", orderId: (d.order as any)?.id });
                            toast({ title: "Resolved for buyer" });
                          }}>Refund Buyer</Button>
                          <Button size="sm" variant="outline" onClick={() => {
                            resolveDispute.mutate({ disputeId: d.id, decision: "Released to vendor", status: "resolved_vendor", orderId: (d.order as any)?.id });
                            toast({ title: "Released to vendor" });
                          }}>Release Vendor</Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {!disputes?.length && <p className="text-center py-8 text-muted-foreground">No disputes</p>}
            </div>
          </TabsContent>

          {/* Vendors Tab */}
          <TabsContent value="vendors">
            <div className="space-y-3">
              {vendors?.map(v => (
                <div key={v.id} className={`bg-card border rounded-xl p-4 flex items-center gap-4 ${v.fraud_flagged ? "border-destructive/50" : "border-border"}`}>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold flex items-center gap-2">
                      {v.business_name}
                      {v.verified && <Shield className="w-3 h-3 text-primary" />}
                      {v.fraud_flagged && <Flag className="w-3 h-3 text-destructive" />}
                    </p>
                    <p className="text-xs text-muted-foreground">{v.city}, {v.country} · {v.whatsapp_number}</p>
                  </div>
                  <Badge variant={v.status === "approved" ? "default" : v.status === "suspended" ? "destructive" : "outline"}>{v.status}</Badge>
                  <div className="flex gap-2">
                    {v.status !== "approved" && (
                      <Button size="sm" variant="outline" onClick={async () => {
                        updateVendorStatus.mutate({ vendorId: v.id, status: "approved" });
                        if (v.email) {
                          const { subject, html } = emailTemplates.vendorApproval(v.business_name);
                          sendEmail({ to: v.email, subject, html }).catch(console.error);
                        }
                        toast({ title: "Vendor approved and notified" });
                      }}>Approve</Button>
                    )}
                    {v.status !== "suspended" && (
                      <Button size="sm" variant="destructive" onClick={() => { updateVendorStatus.mutate({ vendorId: v.id, status: "suspended", suspensionReason: "Admin action" }); toast({ title: "Vendor suspended" }); }}>Suspend</Button>
                    )}
                    <Button size="sm" variant={v.fraud_flagged ? "outline" : "destructive"} onClick={() => { toggleFraudFlag.mutate({ vendorId: v.id, flagged: !v.fraud_flagged }); }}>
                      <Flag className="w-3 h-3" /> {v.fraud_flagged ? "Unflag" : "Flag"}
                    </Button>
                  </div>
                </div>
              ))}
              {!vendors?.length && <p className="text-center py-8 text-muted-foreground">No vendors</p>}
            </div>
          </TabsContent>

          {/* Commissions Tab */}
          <TabsContent value="commissions">
            <div className="flex justify-end mb-3">
              <Button variant="outline" size="sm" onClick={() => exportCSV(commissions || [], "commissions")}>
                <Download className="w-3 h-3" /> Export CSV
              </Button>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Vendor</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Gross</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Commission</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Payout</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  </tr></thead>
                  <tbody>
                    {commissions?.map(c => (
                      <tr key={c.id} className="border-b border-border last:border-0">
                        <td className="p-3">{(c.vendor as any)?.business_name}</td>
                        <td className="p-3">{c.currency} {Number(c.gross_amount).toLocaleString()}</td>
                        <td className="p-3 font-bold text-primary">{c.currency} {Number(c.commission_amount).toLocaleString()}</td>
                        <td className="p-3">{c.currency} {Number(c.vendor_payout).toLocaleString()}</td>
                        <td className="p-3"><Badge variant="outline">{c.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!commissions?.length && <p className="text-center py-8 text-muted-foreground">No commissions yet</p>}
            </div>
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit">
            <div className="flex justify-end mb-3">
              <Button variant="outline" size="sm" onClick={() => exportCSV(auditLog || [], "audit-log")}>
                <Download className="w-3 h-3" /> Export CSV
              </Button>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Action</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Entity</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Details</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                  </tr></thead>
                  <tbody>
                    {auditLog?.map(a => (
                      <tr key={a.id} className="border-b border-border last:border-0">
                        <td className="p-3 font-medium">{a.action}</td>
                        <td className="p-3 text-muted-foreground">{a.entity_type}</td>
                        <td className="p-3 text-xs text-muted-foreground max-w-[200px] truncate">{JSON.stringify(a.details)}</td>
                        <td className="p-3 text-muted-foreground">{new Date(a.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!auditLog?.length && <p className="text-center py-8 text-muted-foreground">No audit entries</p>}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
