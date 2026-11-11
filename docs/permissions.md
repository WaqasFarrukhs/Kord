# Planned permission model (Phase 2)

| Operation | Owner | Admin | Member |
|---|---|---|---|
| Read workspace/shared items | Yes | Yes | Yes |
| Create/update shared items | Yes | Yes | Yes |
| Invite/remove members | Yes | Members only | No |
| Promote/demote admins | Yes | No | No |
| Transfer ownership/delete workspace | Yes | No | No |

Private items remain owner-only, regardless of workspace role. They cannot have other assignees. Shared items require a workspace and current membership; all assignees must be members. Ownership transfer must be atomic and retain exactly one owner. Owners cannot leave without transfer. All queries, mutations, history and subsequent socket events must enforce current access on the server. These rules are design decisions awaiting implementation and tests, not Phase 1 functionality.
