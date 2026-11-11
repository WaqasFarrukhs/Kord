# Kord product scope

Kord brings personal and shared schedules, tasks and recurring routines together across web, Android and iOS, with a self-hosted backend and PostgreSQL database.

## Administration portal

Provide a protected administration portal for the operator to manage registered users, create accounts, deactivate or delete accounts, and change their privileges.

Platform administrator privileges are separate from workspace owner, admin and member roles. Workspace roles govern access within a particular family or team. Platform administrator actions require explicit server-side authorization and an audit history recording who performed each action and when.

Account management must include session revocation when an account is disabled or deleted. Deletion must explicitly address owned workspaces and shared records before it is allowed to finish. Changes to administrator privileges must protect against accidentally removing the last active platform administrator.

The detailed design must define account invitation/setup, deletion versus deactivation, ownership transfer, and which user information administrators can see. Administrative status alone must not silently expose private schedule contents.

Build the initial portal and its access controls during Phase 2, alongside identity and workspaces. Extend its account deletion handling when scheduling data is introduced in Phase 3. Verify privilege boundaries and audit history during Phase 5.

## Learning and delivery preference

Explain completed work in numbered points, using language suitable for a non-programmer. For each technology, explain what it does, why it was selected, what Kord gains from it, and what has actually been verified. Introduce technical terms before relying on them. Proceed through GitHub setup, the Phase 1 walkthrough, and running/testing in that order.
