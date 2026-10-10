"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ALL_ROLES, createUserSchema, updateUserSchema, resetPasswordSchema, type CreateUserInput, type UpdateUserInput, type ResetPasswordInput } from "@/lib/user-schemas";
import { roleLabel } from "@/lib/role-labels";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { Role } from "@prisma/client";

type UserRow = {
  id: number;
  name: string;
  username: string;
  role: Role;
  designation: string | null;
  hospital: { code: string; name: string } | null;
  isActive: boolean;
};

export function UsersAdmin() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [hospital, setHospital] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<UserRow | null>(null);
  const [statusTarget, setStatusTarget] = useState<UserRow | null>(null);
  const [resetTarget, setResetTarget] = useState<UserRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ search, role, hospital });
      const res = await fetch(`/api/users?${params}`);
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? "Failed to load users");
      setUsers(body.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [search, role, hospital]);

  useEffect(() => {
    const id = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(id);
  }, [load]);

  return (
    <div className="space-y-4">
      {/* Page header with illustration */}
      <div className="dashboard-page-heading">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-1">Administration</p>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>👥</span> User Management
            </h1>
            <p className="text-sm text-blue-100/80 mt-0.5">Add, edit, deactivate users and manage role-based access control.</p>
          </div>
          <Button className="bg-white text-blue-900 hover:bg-blue-50 font-semibold shadow-sm" onClick={() => setCreateOpen(true)}>+ Add User</Button>
        </div>
      </div>

      <form className="flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); load(); }}>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or username" className="max-w-xs" />
        <select value={role} onChange={(e) => setRole(e.target.value)} aria-label="Filter by role" className="h-9 rounded-md border px-3 text-sm">
          <option value="all">All roles</option>
          {ALL_ROLES.map((r) => (
            <option key={r} value={r}>{roleLabel(r)}</option>
          ))}
        </select>
        <select value={hospital} onChange={(e) => setHospital(e.target.value)} aria-label="Filter by hospital" className="h-9 rounded-md border px-3 text-sm">
          <option value="all">All hospitals</option>
          <option value="DHQ">DHQ</option>
          <option value="MMMTH">MMMTH</option>
          <option value="WC">W&C</option>
        </select>
        <Button type="submit" variant="outline">Filter</Button>
      </form>

      {error && <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {loading && <p className="text-gray-500">Loading users...</p>}
      {!loading && !error && users.length === 0 && <p className="rounded-md border bg-white px-4 py-8 text-center text-gray-500">No users found.</p>}

      {!loading && users.length > 0 && (
        <>
          <div className="hidden overflow-x-auto rounded-xl border bg-white md:block">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Hospital</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3">{u.username}</td>
                    <td className="px-4 py-3">{roleLabel(u.role, u.hospital?.code)}</td>
                    <td className="px-4 py-3">{u.hospital ? u.hospital.name : "All Hospitals"}</td>
                    <td className="px-4 py-3">
                      <Badge className={u.isActive ? "bg-emerald-600" : "bg-gray-400"}>{u.isActive ? "Active" : "Inactive"}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditTarget(u)}>Edit</Button>
                        <Button variant="outline" size="sm" onClick={() => setStatusTarget(u)}>{u.isActive ? "Deactivate" : "Activate"}</Button>
                        <Button variant="outline" size="sm" onClick={() => setResetTarget(u)}>Reset Password</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 md:hidden">
            {users.map((u) => (
              <div key={u.id} className="rounded-xl border bg-white p-4 shadow-sm">
                <p className="font-semibold">{u.name}</p>
                <p className="text-sm text-gray-500">{u.username}</p>
                <p className="text-sm">{roleLabel(u.role, u.hospital?.code)}</p>
                <p className="text-sm text-gray-500">{u.hospital ? u.hospital.name : "All Hospitals"}</p>
                <Badge className={u.isActive ? "bg-emerald-600" : "bg-gray-400"}>{u.isActive ? "Active" : "Inactive"}</Badge>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditTarget(u)}>Edit</Button>
                  <Button variant="outline" size="sm" onClick={() => setStatusTarget(u)}>{u.isActive ? "Deactivate" : "Activate"}</Button>
                  <Button variant="outline" size="sm" onClick={() => setResetTarget(u)}>Reset Password</Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <CreateDialog open={createOpen} onOpenChange={setCreateOpen} onSaved={load} />
      {editTarget && <EditDialog target={editTarget} onClose={() => setEditTarget(null)} onSaved={load} />}
      {statusTarget && <StatusDialog target={statusTarget} onClose={() => setStatusTarget(null)} onSaved={load} />}
      {resetTarget && <ResetDialog target={resetTarget} onClose={() => setResetTarget(null)} onSaved={load} />}
    </div>
  );
}

function CreateDialog({ open, onOpenChange, onSaved }: { open: boolean; onOpenChange: (v: boolean) => void; onSaved: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const role = useWatch({ control, name: "role" }) ?? "";

  const onSubmit = async (values: CreateUserInput) => {
    setServerError(null);
    const res = await fetch("/api/users", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(values) });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      setServerError(body?.error ?? "Could not create user");
      return;
    }
    reset();
    onOpenChange(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Add User</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
          <div><Label htmlFor="cu-name">Name</Label><Input id="cu-name" {...register("name")} />{errors.name && <p role="alert" className="text-sm text-red-600">{errors.name.message}</p>}</div>
          <div><Label htmlFor="u-username">Username</Label><Input id="u-username" {...register("username")} placeholder="e.g. ms.mmmth" />{errors.username && <p role="alert" className="text-sm text-red-600">{errors.username.message}</p>}</div>
          <div>
            <Label htmlFor="cu-role">Role</Label>
            <select id="cu-role" {...register("role")} className="h-9 w-full rounded-md border px-3 text-sm">
              {ALL_ROLES.map((r) => <option key={r} value={r}>{roleLabel(r)}</option>)}
            </select>
            {errors.role && <p role="alert" className="text-sm text-red-600">{errors.role.message}</p>}
          </div>
          <div><Label htmlFor="u-designation">Designation</Label><Input id="u-designation" {...register("designation")} /></div>
          <div>
            <Label htmlFor="u-hospital">Hospital</Label>
            <select id="u-hospital" {...register("hospitalCode")} className="h-9 w-full rounded-md border px-3 text-sm">
              <option value="">None (all hospitals)</option>
              <option value="DHQ">DHQ</option>
              <option value="MMMTH">MMMTH</option>
              <option value="WC">W&C</option>
            </select>
            {errors.hospitalCode && <p role="alert" className="text-sm text-red-600">{errors.hospitalCode.message}</p>}
            {(role === "medical_superintendent" || role === "health_desk_officer") && (
              <p className="text-xs text-gray-500">This role requires a hospital assignment.</p>
            )}
          </div>
          <div><Label htmlFor="u-password">Password</Label><Input id="u-password" type="password" {...register("password")} />{errors.password && <p role="alert" className="text-sm text-red-600">{errors.password.message}</p>}</div>
          {serverError && <p role="alert" className="text-sm text-red-600">{serverError}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Create User"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditDialog({ target, onClose, onSaved }: { target: UserRow; onClose: () => void; onSaved: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: { name: target.name, role: target.role, designation: target.designation ?? "", hospitalCode: (target.hospital?.code as "DHQ" | "MMMTH" | "WC" | undefined) ?? undefined },
  });

  const onSubmit = async (values: UpdateUserInput) => {
    setServerError(null);
    const res = await fetch(`/api/users/${target.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(values) });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      setServerError(body?.error ?? "Could not update user");
      return;
    }
    onClose();
    onSaved();
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogTitle>Edit User</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
          <div><Label htmlFor="u-name">Name</Label><Input id="u-name" {...register("name")} />{errors.name && <p role="alert" className="text-sm text-red-600">{errors.name.message}</p>}</div>
          <div>
            <Label htmlFor="u-role">Role</Label>
            <select id="u-role" {...register("role")} className="h-9 w-full rounded-md border px-3 text-sm">
              {ALL_ROLES.map((r) => <option key={r} value={r}>{roleLabel(r)}</option>)}
            </select>
          </div>
          <div><Label htmlFor="u-designation">Designation</Label><Input id="u-designation" {...register("designation")} /></div>
          <div>
            <Label htmlFor="u-hospital">Hospital</Label>
            <select id="u-hospital" {...register("hospitalCode")} className="h-9 w-full rounded-md border px-3 text-sm">
              <option value="">None (all hospitals)</option>
              <option value="DHQ">DHQ</option>
              <option value="MMMTH">MMMTH</option>
              <option value="WC">W&C</option>
            </select>
            {errors.hospitalCode && <p role="alert" className="text-sm text-red-600">{errors.hospitalCode.message}</p>}
          </div>
          {serverError && <p role="alert" className="text-sm text-red-600">{serverError}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function StatusDialog({ target, onClose, onSaved }: { target: UserRow; onClose: () => void; onSaved: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const confirm = async () => {
    setServerError(null);
    setIsSubmitting(true);
    const res = await fetch(`/api/users/${target.id}/status`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ isActive: !target.isActive }) });
    const body = await res.json().catch(() => null);
    setIsSubmitting(false);
    if (!res.ok) {
      setServerError(body?.error ?? "Could not change status");
      return;
    }
    onClose();
    onSaved();
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogTitle>{target.isActive ? "Deactivate User" : "Activate User"}</DialogTitle>
        <p className="mt-2 text-sm text-gray-600">
          {target.isActive
            ? `Are you sure you want to deactivate ${target.name}? They will no longer be able to log in.`
            : `Are you sure you want to activate ${target.name}?`}
        </p>
        {serverError && <p role="alert" className="mt-2 text-sm text-red-600">{serverError}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={confirm} disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Confirm"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ResetDialog({ target, onClose, onSaved }: { target: UserRow; onClose: () => void; onSaved: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (values: ResetPasswordInput) => {
    setServerError(null);
    const res = await fetch(`/api/users/${target.id}/reset-password`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(values) });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      setServerError(body?.error ?? "Could not reset password");
      return;
    }
    onClose();
    onSaved();
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogTitle>Reset Password</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
          <div><Label htmlFor="u-password">New Password</Label><Input id="u-password" type="password" {...register("password")} />{errors.password && <p role="alert" className="text-sm text-red-600">{errors.password.message}</p>}</div>
          {serverError && <p role="alert" className="text-sm text-red-600">{serverError}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Reset Password"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
