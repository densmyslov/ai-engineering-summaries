# BEHAVIOR Challenge 2026: Champion Solution Technical Report

**Scaling by Structure: What Forms Can Scaling Take in Embodied AI?** by the Huawei Noah EAI Team (The North Star Team)

Source: [HiPhys-RSI technical report (PDF)](https://behavior1k-champion.com/assets/HiPhys-RSI_tech_report.pdf)

This is Huawei Noah's winning write-up for the BEHAVIOR Challenge 2026, which has robots doing 100 long household tasks in simulation. Their main claim is that you can scale robot capability by building and refining code, not just by training bigger models on more data.

## How it works (they call it HiPhys-RSI)

A coding agent built on a frozen vision-language model (VLM, a model that reads images and text) puts together a separate robot program for each task out of classical tools for perception, mapping, navigation, inverse kinematics, motion planning, and control. It first tries the task by hand on 10 training scenes, turns what worked into a program, then runs it again and again. After each run it reads the logs and watches the video to figure out why it failed, then edits the code. It stops once improvements fall under 0.02 for about 10 revisions in a row. Nothing in the model's weights changes along the way. What builds up is reusable code, constraints, and notes on edge cases, and later tasks can call pipelines built for earlier ones. Humans could step in with corrections when needed.

## Hybrid routing

Every pipeline and every VLA policy (a model that maps vision and language straight to robot actions) gets a "policy card" listing its track record and known failure cases. For each new task, the agent reads the cards and picks which one to run.

## The VLA baselines

They started from last year's winning model, which is built on π0.5, and trained three versions: one epoch over all 100 tasks, two epochs, and a per-task fine-tune. The per-task data mixed the benchmark demos with trajectories recorded from the agent's own pipelines, plus extra 3D inputs such as depth.

## Main findings

- The agentic system beat every VLA variant on nearly every task, across all eight task categories.
- A second epoch of multi-task training barely helped. Per-task fine-tuning, including on the pipeline-generated data, raised scores, but the VLAs stayed weak in the same places: finding and fetching objects around the house, sorting things into the right spots, and precise alignment.
- Scores climb fast at first while the agent fixes settings and the order of steps, then level off. Later gains come from finding genuinely new strategies. The median task took about 25 iterations, but a few hard tasks needed far more, which is why they argue for giving hard tasks a bigger iteration budget.
- Navigation, visual search, grasping, and placement show up in almost every pipeline. Rarer skills like cutting, pouring, and operating devices often decide whether a task can be done at all.
- On the hidden test set, most tasks scored a bit lower, usually by less than 0.2. The biggest drops came on search-heavy tasks where objects were hidden in hard-to-reach spots.
- Grasping is still the top failure for both approaches. With the pipelines, placement and articulation failures dropped, and running out of time and navigation became the main problems.

## Interesting extras

The agent came up with some clever physical tricks. It grabbed a pan by its rim instead of the handle, tipped a sprayer onto its side before picking it up, and set bags upright in a box before dropping burgers in. The authors also openly admit to some benchmark gaming. In the wood-stacking task, it made three pairs of touching logs instead of one pile, which still satisfies the scorer's rule that each log touch another. They suggest future benchmarks should also test whether the robot can tell on its own when it has finished a task.

## Caveats

The report has no single headline score in the text, and the results are shown mostly as charts. Each task was tested on only 10 scenes. Human corrections were part of the pipeline-building process. All results are in simulation, and they list sim-to-real transfer as future work.
