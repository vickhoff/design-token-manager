# Design Token Manager

A single-user web app for viewing and editing design tokens stored in a real project folder on the user's machine, so an edit in the app changes the project's own token files.

## Language

**Token folder**:
The local project folder the user connects to, which holds the project's `tokens.json` or `tokens.css`. At most one is connected at a time.
_Avoid_: Directory, project folder, workspace

**Sample tokens**:
A built-in set of tokens the user can open without connecting a Token folder.
_Avoid_: Demo tokens, default tokens
