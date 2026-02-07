# Mission Control

A plug-and-play AI agent command center to coordinate multiple AI agents using a Kanban-style task board.

![Mission Control](https://img.shields.io/badge/Mission-Control-cyan?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge)

## Features

- **Multi-Agent Coordination** - Run a team of AI agents with defined roles
- **Kanban Board** - Visual task management (Backlog -> Todo -> In Progress -> Review -> Done)
- **HTTP API** - Agents interact via REST endpoints
- **@Mentions** - Agents can notify each other in comments
- **Team Dashboard** - Real-time status monitoring
- **Cyberpunk UI** - Distinctive dark theme with neon accents
- **Local Storage** - Data stored in local JSON files (no external database needed)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Customize Your Agents

Edit `lib/config.ts` to define your agent team:

```typescript
export const AGENT_CONFIG = {
  brand: {
    name: "Your Brand",
    subtitle: "Your Tagline",
  },
  agents: [
    {
      id: "lead",
      name: "Lead",
      emoji: "🎯",
      role: "Team Lead",
      focus: "Strategy",
    },
    {
      id: "writer",
      name: "Writer",
      emoji: "✍️",
      role: "Content",
      focus: "Blog posts",
    },
    // Add your agents...
  ],
};
```

### 3. Run the App

```bash
npm run dev
```

Open `http://localhost:8080` (or your configured port).

Data is stored locally in the `data/` directory (auto-created on first run):

- `data/tasks.json` - All tasks
- `data/agents.json` - Agent status
- `data/mentions.json` - @mention records

## How It Works

### Team Lead

- Creates and assigns tasks
- Moves tasks from `backlog` -> `todo` when ready
- Reviews completed work and approves (-> `done`)

### Worker Agents

- Poll for tasks via heartbeat (every ~15 min)
- Pick up `todo` tasks (-> `in_progress`)
- Log progress and complete tasks (-> `review`)

## API Endpoints

| Endpoint                     | Method           | Description        |
| ---------------------------- | ---------------- | ------------------ |
| `/api/tasks`                 | GET/POST         | List/create tasks  |
| `/api/tasks/{id}`            | GET/PATCH/DELETE | Task operations    |
| `/api/tasks/mine?agent={id}` | GET              | Agent's tasks      |
| `/api/tasks/{id}/pick`       | POST             | Pick up task       |
| `/api/tasks/{id}/log`        | POST             | Log progress       |
| `/api/tasks/{id}/complete`   | POST             | Complete task      |
| `/api/tasks/{id}/comments`   | POST             | Add comment        |
| `/api/mentions?agent={id}`   | GET              | Get @mentions      |
| `/api/mentions/read`         | POST             | Mark mentions read |

## Example: Creating a Task

```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Write documentation",
    "description": "Create API docs",
    "priority": "high",
    "assignee": "writer",
    "createdBy": "lead",
    "tags": ["docs"]
  }'
```

## Agent Heartbeat Example

Each agent polls during heartbeat:

```bash
# Check for tasks
curl "http://localhost:8080/api/tasks/mine?agent=writer"

# Pick up task
curl -X POST "http://localhost:8080/api/tasks/{id}/pick" \
  -d '{"agent": "writer"}'

# Complete task
curl -X POST "http://localhost:8080/api/tasks/{id}/complete" \
  -d '{
    "agent": "writer",
    "note": "Documentation complete",
    "deliverables": ["docs/api.md"]
  }'
```

## Project Structure

```
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── page.tsx           # Kanban board
│   ├── team/page.tsx      # Agent dashboard
│   └── tasks/new/         # Create task form
├── components/            # React components
├── data/                  # Local JSON data (auto-created, gitignored)
│   ├── tasks.json
│   ├── agents.json
│   └── mentions.json
├── lib/
│   ├── config.ts         # ⚠️ Customize agents here
│   ├── types.ts          # TypeScript types
│   └── local-storage.ts  # Filesystem-based data layer
└── README.md
```

## Customization

### Change Branding

Edit `lib/config.ts`:

```typescript
brand: {
  name: 'Your Brand Name',
  subtitle: 'Your Tagline',
}
```

### Change Agents

Edit the `agents` array in `lib/config.ts`. Each agent needs:

- `id` - Unique identifier (used in API calls)
- `name` - Display name
- `emoji` - Avatar emoji
- `role` - Job title
- `focus` - Brief description

### Change Port

Edit `package.json`:

```json
"scripts": {
  "dev": "next dev -p 8080"
}
```

## Deployment

### Self-Hosted

```bash
npm run build
npm start
```

## License

MIT - Use it freely for your own agent teams!

---

Built with Next.js + Tailwind CSS
