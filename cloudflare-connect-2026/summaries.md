# Cloudflare Connect 2026 talk summaries

These 13 talks are the videos from the [Cloudflare Connect 2026 playlist](https://www.youtube.com/watch?v=_LYr4dSmdsk&list=PLN--OSeSiMrM). The first two were summarised earlier in this chat; the other 11 were taken from the public YouTube pages. A few names and model names were unclear in the auto-transcript of those 11; those are flagged in place.

# [Building an open agentic Internet](https://www.youtube.com/watch?v=_LYr4dSmdsk)

Michael Tremante.

A ~34-minute Cloudflare Connect 2026 talk on building an open “agentic internet”: one agents can read, discover, call, and pay for, without a few big stacks owning discovery, identity, and payments.

**The core problem**
- The core problem is that most traffic Cloudflare sees is now bots, while human visits — and the ad and subscription revenue that depend on them — are falling, because people ask ChatGPT or Claude instead of opening the site.
- News publishers are the canary. Referrer data is bleak (he cites Perplexity sending back about one human visit per 3,400 crawls). Big publishers are already signing direct deals with model providers; smaller sites usually can’t.

**Practical fixes, all meant to stay under the site owner’s control in the Cloudflare dashboard**
- A /crawl endpoint, limited to cryptographically signed bots (Web Bot Auth), that serves markdown so crawlers don’t hammer your origin
- An opt-in open search index of sites behind Cloudflare (about 20% of the web), plus discovery signals — a trial with OpenAI found several million new domains
- Content crawl control, so you can allow access by purpose (training, inference, referral back to your site) and push that as an industry standard
- Pay-per-use (still in development, trust-based, with bidding): get paid when a model reuses content after crawling it once
- Monetization Gateway (private beta, built on the open x402 standard): charge at access time via HTTP 402 with cryptographic proof of payment — useful for APIs and for smaller players who can’t cut big licensing deals. He also mentions Cloudflare’s Net Dollar stablecoin as part of scaling micropayments.

**Q&A**
- In Q&A he stresses that pricing, blocking, or giving access away is the publisher’s choice; /crawl helps if a bot already knows you exist, while AI Search is how unknown sites get found; and the hard part is the long tail of crawlers (including subscription resellers and residential proxies) trying to bypass all of this.

---

# [It's time to build, not buy](https://www.youtube.com/watch?v=-_qUn_LfJ6M)

Ryan Skidmore, from Cloudflare, who works on developer productivity and AI.

His argument: AI has made it realistic to build your own software instead of buying it, but you still have to run and maintain what you build, so the real question is whether you should build it, not whether you can.

**Why the old advice is shifting**
- "Don't reinvent the wheel" used to make sense. Building took months, needed a team and meant someone on call, while buying got you live within weeks.
- Buying now has its own pain. He cites SaaS prices up 16.4% in a year, 65% of licences going unused, and 79% of IT leads hit with price rises at renewal.
- AI got much cheaper and more capable. For the same benchmark score, the cost of input tokens fell about 75 times between March 2023 and April 2025. On METR's measure of how long a task a model can finish on its own, models went from about 4 minutes with GPT-4 to about 12 hours with Claude Opus 4.6, and the newest models are off the scale.

**Case study: Cloudflare's internal AI code reviewer**
- They tried off-the-shelf AI review tools first. None were flexible enough, and vendors wouldn't guarantee what they promised. He built the first version in an afternoon: a git diff and a basic prompt. It's now a much bigger system built on the open-source OpenCode agent and runs in GitLab. About 500 changes have come from people all over the company, which is the big upside of owning the tool.
- Every merge request at Cloudflare has to pass it. It has run just over a million reviews across about 350,000 merge requests and almost 7,000 repositories, and it blocked about 16,000 merges in four months. The wait for a first review went from hours to minutes. Each review now costs $0.67, after they cut their AI bill by 68% through optimisation. There's a fallback so engineers can still ship if an AI provider goes down.
- The lesson: flag only what people will actually act on. Early versions of the reviewer flagged everything they could, assuming more findings meant more value. Engineers said in feedback that a lot of it was nitpicks and minor stuff that didn't need fixing. So they changed it to flag only problems people care about and would actually fix. After that, people acted on a bigger share of the findings, because each one was more important and worth their time. The idea behind it, which he implies but doesn't spell out, is that every comment costs the engineer time to read and decide on. If most of them are trivial, the important ones get lost in the noise. Fewer, better comments get more action.
- Its limits: it mostly sees only the diff, not the design behind the change. It can't cheaply check the effect on up to 100 connected services, it misses timing-dependent race bugs, and huge changes of millions of lines don't fit in the model's context. It doesn't replace human review.

**His rules for build or buy**
- If it's critical and nothing on the market fits, build it. If it's critical and a product fits well, buy it, but make sure you can leave the vendor. If it isn't critical, compare the price with what the tokens to build it would cost, which keeps getting cheaper. Or build something small and see.
- Before building, work out exactly what's wrong with your current tool. Prototype in an afternoon, not five weeks. Count security, maintenance and on-call costs. Reuse existing parts (he used OpenCode, Workers KV and AI Gateway), measure everything, and keep a way out.
- Expect to replace your tools. With better models, a rebuild in six months may take half the time, so tech debt matters less than solving the problem now.
- Watch out for "personal software" sprawl. A thousand employees each building their own version of the same tool is a mess.

**Q&A**
- Asked why the reviewer doesn't just run on the developer's laptop: AI isn't deterministic, so they review adversarially from about five angles. A local version exists, but its results are harder to track.
- On standards: they push linters, RFCs and agent skills onto developers' machines so code follows the standards from the start. He says recent models wait for CI, read the review comments and fix them in a loop until the merge request is ready.

---

# [Break the ceiling of internal productivity with a fast, global filesystem](https://www.youtube.com/watch?v=xMg9VDCQVWM)

Jackie, co-founder and co-CEO of Relevance AI.

A five-person team spent three months building Arg, a shared filesystem and workspace for people and agents. That one foundation was enough to ship a productivity suite, an internal app builder, and automated “loops.”

**Why files, and what they shipped**
- On Cloudflare Radar, agentic traffic is a growing share of the internet. Jackie estimates about 60% of visits to a typical website may already come from agents, so teams now have to build for employees and for their agents.
- Arg stands for Agent Research Group, also nodding to the programming term “arg” and a three-letter domain he already owned. They concluded productivity had to start with files, because apps, databases and documents are all files.
- In about three months, with five people — closer to three and a half engineers, he said — they shipped a mobile app, desktop app, CLI, SDK and the workspace. Three surfaces share one versioned filesystem: a suite meant to cover tools such as Google Docs, Notion, Figma, Asana and Dropbox; an internal app builder; and “loops,” or workflow automations. Making the filesystem durable and audited once meant every surface on top got those properties for free.

**Cost, Cloudflare, and results**
- Using the Google Docs MCP costs about 21 times more tokens than MDX, or about $1,200 extra per agent per year, he said. Forms in Qualtrics or SurveyMonkey were at least nine times more. Leaner formats also scored better in evals on small models such as DeepSeek and Luna.
- They built on R2 and Durable Objects: Durable Objects for real-time collaboration, R2 for free egress. A custom mount was, he said, up to about 130 times faster on `ls` lookups than standard S3FS. Internal apps run in Cloudflare Sandboxes — they sometimes persist a sandbox and open a tunnel — or via Workers for Platforms. In their tests, Sandbox felt quicker than Modal, especially in Asia and Australia.
- Loop engineering means designing the system that prompts the agent, rather than prompting it by hand. Their loops already open pull requests from frontend bugs and customer feedback. One engineer built a 2D, then 3D, farm dashboard where agents produce the work and he approves it, instead of living in GitHub. A go-to-market engineer built a similar factory for content instead of using Salesforce or HubSpot.
- They had launched about a month earlier. Enterprise use of Arg went from four and a half the previous week to more than ten, including companies such as Databricks, Uber and Canva starting to try it. Jackie said it is now their most popular and stickiest product. His one wishlist item was Cloudflare Postgres.

---

# [Sentry at Cloudflare Connect: The prompt is lava](https://www.youtube.com/watch?v=fPfVJ1pd_B4)

Greg, an engineer at Sentry.

Prompt injection is a real risk in observability tools, because attackers can hide instructions in fake errors that agents then follow. Catching that at Sentry’s scale means a cheap first filter on millions of events, not a frontier model on every one.

**The attack**
- A fetched skill can hide a script or secret instructions that an unsandboxed agent will run. Greg said frontier models were very willing to follow them. The same idea works in observability. Client apps send untrusted telemetry to a public DSN endpoint, which Sentry calls Relay. That data is rolled up into issues, which humans, MCP clients, and Sentry’s debugging agent Seer then read. An attacker can file a bogus error that tells the agent to install a “diagnostics” package whose post-install script steals data. He said this risk exists today on all major observability platforms. The best moment to catch it is before an issue is created, and before webhooks fire.

**The pipeline**
- Asking a large model such as Opus on every event worked in tests, but was too slow and expensive. They see on the order of 100 actually malicious events a day, while processing hundreds of millions of events. A heuristic now sends about 10 million events a day into detection. He wants that closer to a billion, and would not describe the heuristic, because it could be bypassed.
- Until about the end of August, a small model (the transcript sounds like “GPT-3 SS”) was their best option. In September they moved to “decision models,” which return a 0–1 malice score. Those were about three times cheaper than their cheapest language model, and more accurate, but still not cheap enough at 100 times the volume. Some, including ones he called Mercury Decider and Perplexity Decider, also flagged many benign issues, which would have sent around half a million events to the expensive reviewer.
- They started fine-tuning text encoders such as MMBERT and ModernBERT, around 150 million parameters, and reached more than 90% accuracy without a full labeling loop yet. On a similar load, on “not too many GPUs,” he put the cost at about 12K; at 100 times the volume, he thought that could stay this side of a million-dollar bill. A further idea, still hypothetical, is distilling into a roughly 4-million-parameter model, about $700 a day on full load — he said a slide figure was wrong — and well under 1 millisecond per event.

**Q&A**
- Classification runs on rented L4 GPUs in GCP; they self-host their own classifiers. A classifier alone is not enough; he would also check mentioned packages. The distilled model will go live when it matches or beats current accuracy. Seer is a more expensive backstop. They considered scanning only when someone fetches an issue, but saw that as largely duplicative.

---

# [Turning data questions into data infra with Cloudflare Basin](https://www.youtube.com/watch?v=NlRTSleUkE0)

Micah, a principal engineer at Cloudflare and tech lead for Cloudflare Basin.

Basin is Cloudflare’s new serverless data-infrastructure suite — a catalog, pipelines, and a SQL engine — built so an agent can ask a question, notice missing data, instrument the app, and query the results without weeks of hand-offs between data and application teams.

**The old loop, and a live demo**
- He framed the talk as CEO of a fictional mountaineering shop, “Basin Mountain.” Sales are down, traffic looks normal, but checkout events were never instrumented. In the usual process a data team files a ticket, application engineers add events weeks later, then a pipeline is built. He has seen that cycle hundreds of times, and by the time the answer arrives it is often too late.
- With conference Wi-Fi and Claude, he asked for order volume, then why orders were low. The assistant found traffic steady and conversions later dropping, but could not explain the gap because the data was missing. He asked it to instrument the checkout flow. At the end, Claude had added instrumentation and created the pipeline and catalog resources, ready to deploy.

**The three products**
- All three went generally available about three weeks earlier at Birthday Week, billed serverless with no long-term commit. **Basin Catalog** is a managed Apache Iceberg catalog on R2, which does not charge egress fees. Spark, Snowflake, Databricks, DuckDB and PyIceberg can all query it, and compaction is automatic if you turn it on. **Basin Pipelines** ingest via a Worker binding, HTTP, or Logpush from Cloudflare’s CDN and security products, and you can reshape events with SQL before they land. Logpush is now available to everyone, not only enterprise customers. **Basin SQL** is a distributed query engine across the Cloudflare edge. He said it can scale to petabytes, and that highly parallel queries can scan petabytes in seconds.

**Why it fits agents, and Q&A**
- They started building about two years ago, so agents can create, inspect and tear down resources through an API and CLI, with no cluster sizing or contracts. Cloudflare’s cache keeps repeated agent queries from going back to cold storage. His practical advice in 2026 was to tell Claude to instrument the app with Basin.
- On conflicting definitions of “revenue,” he said this is still hard: it helps if the agent can see the collecting code and the pipelines, but humans still need to agree what the numbers mean. Jurisdiction limits on where compute and storage live, for example in the EU or the US, are not available yet, but are coming in Q4. Custom role-based access control, such as HR-only performance reviews, is not available today, but is coming soon. He has thought about a “Basin for Platforms” isolation model, but did not announce it.

---

# [TanStack Start on Workers: Server-rendering apps an AI just wrote](https://www.youtube.com/watch?v=CkGY-wtQ0Q0)

Fabian, from Lovable.

Lovable moved from static React apps in R2 to server-rendered TanStack Start apps on Cloudflare’s dynamic Workers, so it can host tens of millions of AI-generated apps on demand — including Lovable itself — with cold starts under a second.

**Scale, and the migration**
- Since launch they have created 70 million applications, about 1 million new ones a week. Those apps get more than 1 billion visits a month. A Cloudflare contact in the room had given him a fresh figure of about 7 billion requests a day to these Workers. That is far too many apps to keep warm on traditional servers.
- They started with client-rendered React apps, serving static assets from R2, always on Vite. Earlier this year they moved to TanStack Start, mainly for SEO through server-side rendering, and because one isomorphic codebase is easier for an AI to work with. Routes can still be marked static when they do not need compute.

**How serving works**
- In March, Cloudflare released dynamic Workers, which let a normal Worker spawn another Worker. App code lives in R2 and is cached in KV. A single proxy Worker receives every request, such as `myapp.lovable.app`, looks up the code location, latest version and access rules, then either serves static files itself or starts a dynamic Worker. Cold start from fully cold in R2 to a ready Worker is less than one second, which he said most users never notice.
- Server rendering “dehydrates” HTML and data so the browser can paint before any client JavaScript runs, then hydrate for interactivity. Functions with secrets run on the server; TanStack Start replaces them with request stubs in the browser. Secrets are stored encrypted and bound into the dynamic Worker at startup. A secret change invalidates the isolate and starts a new Worker without a new app deployment.

**Dogfooding and lessons**
- The largest app on Lovable today is Lovable itself, migrated from Next.js onto this stack so scaling problems show up internally first. Each isolate has a soft limit of 128 MB. After the migration they hit out-of-memory errors from leaking a TypeScript compiler and a syntax highlighter into the server bundle. Those lessons are now encoded into the builder agent that produces more than a million apps a week. Cold starts are the expensive part, so they cache bundles in KV, keep them small, and pre-render at publish time — within 10 seconds, he said — serving static HTML when they can. He credited close work with Tanner and the TanStack team. He offered to stay for questions; the recording has no formal Q&A.

---

# [Generative media's breakthrough moment: Insights from Runway](https://www.youtube.com/watch?v=-gfvKxhNbaw)

A conversation between a Cloudflare host (he refers to himself as Mark) and Anthony, Chief Product Officer at Runway, in the role about four months. Runway builds video and world models, plus apps for marketers, creatives and developers.

Anthony argued that generative media is in the same kind of mass-adoption moment coding hit after models such as Opus 4.5: a small share of teams already produce production-ready work at surprising speed, and that is starting to spread.

**What teams are already doing**
- He estimated that about 10 to 15% of people on a typical creative or marketing team have already figured out how to use these models at a high level.
- Amazon MGM used video models on *House of David* and, in some areas and scenes, cut post-production from five months to a couple of days. Chime wanted a TV spot showing hundreds of members rather than about nine. Members sent photos, those became video, and it aired on television in a couple of days, versus a budget of several hundred thousand dollars and weeks of shooting. A major studio green-lit a docu-series mixing human interviews with AI-generated historical footage because the lower cost reduced the risk. A self-serve user gave a coding agent a Runway budget under $100, and it turned blog posts into a YouTube how-to series.

**Products and use cases**
- Runway Agent acts as a video producer: it takes a brief, plans scenes, character references, audio and lip-sync, and calls a mix of video, audio, image and editing models. He said quality is also rising because each new frontier language model — he mentioned examples such as Opus 5.5 and Astra — makes the production agent better at one-shot results. In July they released a media model router for developers, which he said was an industry first. An average developer, he said, sees about a 66% cost reduction versus always using the most expensive model.
- He recommended true localization, not just translated copy: a commercial shot in New York can be made to feel built for London or Brazil. A European customer with a content team of about 15 people now localizes every market and campaign. He also uses generated slide visuals instead of hunting stock photos, and said internal video teams now send back regenerated variations of a speaker instead of asking for a reshoot.

**What’s next, and Q&A**
- Real-time video generation is becoming faster than people can watch. Runway is developing a video model that can power a software interface: a live, clickable video, for example a virtual dressing room or a visualized travel itinerary. He confirmed this is the Solaris world model. It is with a few design partners and is opening to more each week; it is not generally available yet.
- Asked how stylists and makeup artists fit in, he said art direction and taste are not going away; the skill is turning a brief into prompts so the output does not all look the same. Asked about video made for language models and agents as well as humans, he had not seen much of that yet on the video side, but expected it would come.

---

# [An agent that onboards a photography studio — on Workers AI](https://www.youtube.com/watch?v=I4AMpO2KCTA)

Andreas Salme, senior director of software engineering at Disco, a photography platform for capture, editing, community, and the business side of a studio.

Disco built Scout, an in-product agent on Workers AI, to do real CRM work for photographers — invoices, jobs, contracts — and found that creatives accept AI much more readily on the business side than in the creative tools themselves.

**The problem, and what Scout does**
- Workspace is Disco’s CRM for automations, quotes, contracts, leads and payments. Photographers often know the outcome they want, such as “send an invoice,” but not where to click, and actions have dependencies: an invoice needs a job and a client record.
- Scout is a multi-turn chat assistant inside the web app. It began as a guarded onboarding helper and has since grown to day-to-day studio work. It must actually read and write studio data, never claim success without re-reading the record, hand off a deep link if it cannot finish, respect three subscription tiers, remember conversations across devices, ask clarifying questions, and stream replies. The same agent runs in two harnesses: the full classic CRM for Disco One subscribers, and Atlas, a smaller CRM for freemium and other paid plans, with different wording on each surface.

**How it is built**
- A turn such as “create an invoice for this job” loads the thread, current page and studio settings, then calls a model on Workers AI. The system checks the plan tier and preconditions, mutates data, verifies the write, and streams back a card linking to the invoice. Each action is a declarative capability tied to a tier, so adding one is a data and adapter change, not a model retraining.
- They used LangChain, LangGraph, deep agents, and an AG-UI bridge to stream graph events. They picked Workers AI to move quickly, stay model-agnostic with an OpenAI-compatible API, and reuse prior Disco experience. He said they are currently running GLM-class models after testing several. Not all of the stack runs on Cloudflare; his point was that you can adopt pieces of the platform without moving all compute there.

**What’s next, and Q&A**
- More of the Workspace UI will be exposed as APIs. They want to keep evaluating models, look at Durable Objects — which he felt they had underused — and try a newly released decision model (the name is unclear in the transcript) to manage token spend. Conversation state today uses a key-value store; the transcript sounds like Valkey.
- If he started over, he would have put in fewer guardrails, because users quickly tried to do more than onboarding, and he would have looked at Durable Objects sooner. Sensitive data stays in Disco’s own infrastructure; the model is used to choose the next step, not to receive that context. The project started in the summer with two people. They summarize long context before inference to control cost; he did not share exact spend figures. AI in the photo editor has been more polarizing; in the business product they have not had pushback, as long as it is not placed first in editing flows.

---

# [Why modern software engineering needs Durable Objects](https://www.youtube.com/watch?v=75jxhU6z3ho)

Ashley Peacock, who joined Cloudflare about six months earlier to work on Durable Objects, and has been building with them since around 2022.

Durable Objects isolate state into many tiny servers with their own SQLite databases, so a flood of AI traffic or a busy user is less likely to take down a whole app, and they are a cheap place to run large numbers of agents.

**Why they matter now**
- Cloudflare had just reported that AI agent traffic grew by more than 1,700% in the past year. He also showed GitHub availability struggling under the AI wave. Shared databases and containers are hard to scale overnight if an app goes viral. Databricks had seen a 327% increase in multi-agent systems in the past four months. McKinsey, he said, found organizations using AI rose from 20% to 90% between 2017 and 2025.
- He described a Durable Object as “a small but mighty server with its own database.” Each can handle up to 1,000 requests per second, has up to 10 GB of SQLite and 128 MB of memory, and is addressed by a globally unique name, so only one instance exists at a time. Because each object has its own database on the same machine, there is no lock contention across users. He said reads typically complete in less than 1 microsecond. Objects are created on demand and scale to zero when idle. Cloudflare’s Agents SDK sits on them and includes WebSockets, sub-agents, scheduled tasks, tools and MCP. Isolates, he said, are roughly 100 times more efficient than containers.

**How to design them, and new features**
- Avoid the “hot singleton.” One object per Slack workspace would crumple under 1,000 requests per second. Prefer smaller units, such as a channel, and fan out broadcasts across many objects. Place objects near the user, not near a central AWS or Azure backend. Use Cloudflare’s WebSocket APIs so the object can hibernate while the connection stays open at no charge. In-memory fields are wiped on hibernation; anything critical must go to SQLite. Objects are single-threaded, so for parallel tasks he would go even smaller — one object per conversation or task, not per user. For organization-wide settings he suggested D1, which he said is itself a Durable Object with a nicer API and read replicas, and warned against long chains of objects.
- Some newer features were not fully public yet. With pending I/O, an object can stay alive for up to 15 minutes, extended by each new external request, so a model call can finish after the client disconnects. A shutdown hook lets you flush state. On deploy, WebSockets migrate to the new code without client errors, and old code can keep running on a busy object for up to 24 hours, up from 30 seconds. The platform will also automatically retry failed requests when it is safe. Public APIs should live on a Worker, with Durable Objects behind them. Hyperdrive can pool existing Postgres or MySQL connections. He had not measured whether calling Cloudflare-hosted models from a Durable Object is lower-latency, and would not promise it.

---

# [Ferrisway: Ramp's global routing layer on Cloudflare](https://www.youtube.com/watch?v=yeREKpfvuK4)

A production-engineering lead at Ramp. The transcript does not give a personal name. The speaker had been there a little more than a year and a half. Ramp aims to be a financial operating system for companies; he said customers save about 7.5% in the first year.

Ramp is splitting its old monolith into isolated “cells,” and Ferrisway — a Rust WebAssembly Worker at the edge — now routes about half a billion requests a day to the right cell, while a Go service called Go There remains the single source of truth.

**Why cells**
- Growth had packed one load balancer, a largely monolithic app and one huge database. Cells give them room to scale, fault isolation so a bad deploy need not hit 100% of customers, and a path to data residency as they expand, including into Europe. Routing has to stay invisible, so customers keep one URL and Ramp can move them without asking them to change address.
- They have to route uncontrolled webhooks and bank payloads; web and mobile apps, where they can add headers; developer APIs that must keep working unchanged; credit-card authorizations, which cannot afford extra latency; and growing agent and MCP traffic, sometimes across businesses.

**Ferrisway and Go There**
- Go There is a Go service — the name is a pun on “go there” and the gopher — that stores routing keys and cell mappings in DynamoDB. Ferrisway has been in production since January 2026, took only a few weeks to reach 100% of traffic, and is a Cloudflare Worker written in Rust and compiled to WebAssembly. It handles about half a billion requests daily, more than 5,000 requests per second on average, and about 10 TB of traffic a day.
- They extract a routing key from a header, path, query string, JWT, or, most expensively, the body. They have on the order of 100 routing rules — later he said perhaps 100 to 200 — but one major header rule already used by internal apps covers about 90% of cases. Both services share the same YAML rules; Ferrisway compiles them into Rust at build time so Workers start fast. Ferrisway only buffers a tight amount of body data, after out-of-memory errors when concurrent heavy webhooks shared a Worker. Anything it cannot parse goes to Go There.

**Caching, operations, and Q&A**
- Three cache layers, none of them the source of truth: isolate memory with a tiny LRU, answering in under 10 nanoseconds; the Cache API in the point of presence, around 10 milliseconds; then Workers KV, around 100 milliseconds. On a stale-but-valid hit it routes immediately and refreshes in the background. Default expiry was 24 hours; freshness was about five minutes in the discussion. A tail Worker turns logs into traces. Deploys use a 0% canary with a special header, then promotion once checks pass.
- They chose Rust over Go compiled to Wasm because the Go path produced a bloated Worker, and over JavaScript for start time and compile-time checks. The routing core has been stable since January. His team owns rule changes and rolls them through a heavily used QA environment first.

---

# [Building durable agents with Durable Objects](https://www.youtube.com/watch?v=VBsqp3NutAE)

Justin, who runs two companies, Braid and Standard Agents, and is based in Virginia. Braid is a client-services firm that used to build ordinary apps and websites. In the Q&A he is addressed as Justin.

Customers now ask for custom agents that run all the time, with prompts such as “follow up with every lead.” He argues Durable Objects are the right primitive: each conversation thread gets its own isolated compute, SQLite database and scheduler, without a virtual server per customer.

**What an agent needs**
- He defined an agent as “deterministic software that harnesses the non-deterministic results produced by models in pursuit of a desired objective.” In practice you also need thread state, isolation, hooks, step limits, and often a filesystem and code execution. He does not think a single giant model plus an MCP server will replace domain-specific agents. Small models can do small, focused jobs.
- A shared virtual server is an isolation risk, and one server per customer does not scale. Agents need no painful cold start, consistent writes so history can be reread after every tool call, and a way to wake up with no inbound request, for example “tomorrow at 9 a.m.” Replaying full history on every step is an O(n²) read problem, so each thread needs its own ACID database.

**How Durable Objects map, and a demo**
- A Durable Object is a tiny server on a Worker: its own code, a SQLite database up to 10 GB, and HTTP or WebSockets, with 128 MB of memory and no filesystem — they treat the database as files. Workers for Platforms can isolate one customer from another. Cold start is usually about 200 milliseconds. Generated code can run in a dynamic Worker with no network unless you grant it. A Durable Object can hold only one alarm, so they keep a queue in SQLite and set the next alarm each time it fires.
- Attendees each got their own expense-report agent. He said 667 people had already created one, and that 89 reports had cost 19 cents in total because they could use a small model, Luna, for such a narrow task. Three collaborating agents — an accounting coordinator, the user’s helper, and a Google Sheets specialist — are each Durable Objects. The demo took less than an hour to build on their Standard Agents framework.

**Practical tips and Q&A**
- Keep fallback models, and on failure move from a cheap specialist model to a stronger general one, preferably on another provider. To keep a long run alive, set a short alarm rather than tying work only to the inbound HTTP request; he warned that alarms can loop. Set the next alarm before executing the current job. Objects can die mid-run, especially on a deploy — he gave 0.325% in production — so they use a watchdog Durable Object. They often have 20,000 to 50,000 objects running.
- Multiple chats are multiple instances of the same “recipe,” like threads in a sidebar. For parent and child agents he prefers plain language over a rigid schema. To stay inside 128 MB, stream everything and split files into 2 MB SQLite rows. Their platform uses Workers, Workers for Platforms, Workers AI, D1, R2, KV, Queues and Artifacts.

---

# [12 mistakes TELUS made building an agent platform for 100,000 employees](https://www.youtube.com/watch?v=9DGeQ6AeL5o)

Kevin, who does developer advocacy at TELUS, and Andrew, a software engineer there, introduced by their colleague Justin. Later, distinguished engineer Justin Watts appears as “chief refactor officer.” TELUS is a Canadian company with more than 100,000 people in over 45 countries, across telecom, health, farming and digital services, and about 30 ways for staff to sign in.

They built Gizmos, a company-wide sandbox on Cloudflare dynamic Workers, so anyone at TELUS can ship an internal app or agent without a long “last mile” of tickets. In six months they made, and fixed, 12 platform mistakes, which are the subject of the talk.

**The problem**
- Building a prototype is now an afternoon. Sharing it used to mean a nine-step internal guide plus a 20-minute video covering GCP, Kubernetes, Terraform and Helm, and it still ended only in a dev environment. Many first-time builders never finished. Gizmos stands up single sign-on, access control and sharing, offers on-demand databases and KV, and is meant to work with many agents. The public site is gizmos.run; they warned there may be a waitlist.

**The 12 mistakes**
1. **Treating a zip upload as “easy.”** New users got stuck, and agents built things the uploader could not deploy. They added an `llms.txt` and Gizmos Studio: OpenCode in a Cloudflare container, one per person. Watch someone try it before you call it easy.
2. **No metering, limits or billing at first.** People ran expensive jobs such as OCR at huge volume. They added controls after a painful bill.
3. **One “Sign in with Google” button.** Some units are not on Google, and there were more than a dozen domains Kevin did not know existed. They rebuilt sign-in with Better Auth: type your email, then passkey, Google, or a magic link from a Worker.
4. **Scalability bolted on late.** Demos with thousands of people joining at once exposed the gaps.
5. **Analytics stuffed into the main D1.** They were still under 1% of D1’s 10 GB cap, but almost half the rows were events. After moving events to Analytics Engine, sampling broke unique-people counts; once that was fixed, usage appeared about seven times higher. They now see about 10,000 people a month. The database is about 7% full, mostly every app version ever shipped.
6. **Community marketplaces fill with unused to-do apps.** They now feature organization-wide apps, and are adding teams, stars and usage.
7. **No observability, then a self-inflicted outage.** For about five weeks users reported errors in Slack. Adding tracing wrongly made every outbound call return HTTP 500. In June they shipped a status page on its own Worker, polled every five minutes.
8. **Chasing every new framework.** Andrew’s note to himself: do not rewrite the project for the tenth time.
9. **Assuming everyone lives in Claude Code and a terminal.** In August they shipped a Gizmos MCP connector inside Claude, with no terminal or install.
10. **Building one platform to replace all the others.** They still want Gizmos to support other platforms, and joked about a “Gizmos 2” in 2027 if they are not careful.
11. **Vibe-coding bloat.** Nothing was written by hand. Two busy days in August saw 157 commits, with three ways to do the same thing. Justin Watts turned three approaches into one, removed 18,000 lines of comments in a day, and deleted almost 100,000 lines. They still vibe-code everything, but now book the refactor first.
12. **Getting lost in the vibes.** Both wrote this one down independently. If you only specify the outcome, you cannot validate the result.

**Results and Q&A**
- All 12 mistakes happened and were fixed in about six months. 15,000 people have used Gizmos, about 15% of the company, and the previous month had nearly half a million views. Unusual builders include store managers in Nova Scotia and sales teams running “agent farms.” Isolate compute has been “pocket change”; they focus billing on AI usage. They still tell staff not to put highly sensitive data in Gizmos yet, and scan each push for secrets.

---

# [Artifacts: Git-compatible versioned storage, from zero to beta in 3 weeks - by Dillon Mulroy](https://www.youtube.com/watch?v=D_tnYlZe5t8)

Dillon Mulroy, who had been on Cloudflare’s dashboard-agent team working on Agently before being pulled onto this project.

A three-person team took Artifacts — Git-compatible versioned storage on the edge, built entirely by coding agents — from nothing to closed beta in three weeks, including a customer requirement of 1,000 new repositories per second in one namespace, which they met.

**Why now, and how it is built**
- A large multi-tenant customer needed Git storage at the edge, especially small repositories that agents can work on quickly. They chose Git because it is in model training data, every developer already has a client, and it works as general versioned storage, not only for code. They had three weeks until Agents Week for a closed beta, and four weeks until the customer’s own closed beta.
- Matt Carey worked on the Git engine, after a winter break spent on a Zig and WebAssembly implementation. Thomas Ancorn, from observability, helped line up process and teams. Dillon worked on the control plane and developer experience.
- Almost everything is Durable Objects: an account namespace index; sharded registry objects that list repositories; a token manager per repository; and the Git server itself. Design rules: never lose or corrupt Git data; stream, never buffer, because of the 128 MB isolate limit; and never put a single object on the hot path. On create, the name is hashed to one of four registry shards, for a theoretical peak of about 4,000 creates per second. A brand-new repository may not show up in a list immediately. Bytes stream to the Git server in 2 MB SQLite chunks, compressed with zstd. A push first lands in a quarantine table, then is copied into the main tables in one transaction. Repositories are currently capped at about 10 GB. They hope to support Git LFS later.

**The rewrite, a naming bug, and lessons**
- The original Zig and Wasm engine was about 100 KB, but copying across the Wasm boundary burned CPU and memory as they grew toward about 10 million repositories, and later toward or past 20 million. They chose a JavaScript rewrite, led with agents by principal engineer Michael Hart, and ran it against Git conformance tests. On a large workerd repository, peak memory fell from 359 MB to 40 MB. Pushing to an empty Artifacts repository went from 54 seconds to 27 seconds, and cloning from 17 seconds to 8 seconds. His manager, Steve, joked that language does not matter and rewriting does — a view Dillon now takes seriously if you have the token budget.
- He forgot to lowercase repository names, so two names that differed only by case could map to different Durable Objects. Older agents could not fix it without version skew. A later model then one-shotted the change; the auto-transcript sounds like “Fable 51,” which may be a mis-hearing of a model name.
- He believes Artifacts was the first Cloudflare product written entirely by agents, by a team of three in three weeks, with no hand-written code. They still read every line, though they correct less now, and review itself is becoming the bottleneck. In the short Q&A, he did not think Artifacts was used inside a core “Cloudflare OS” product, but said a binding would be enough. On the idea that writing code by hand is dying, he said there will be more software, and it still needs people who have shipped bugs; he worries about how to onboard new developers, and had no neat answer.
