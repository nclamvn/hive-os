---
dataset_info:
  features:
  - name: problem_idx
    dtype: int64
  - name: answer
    dtype: string
  - name: problem
    dtype: string
  - name: source
    dtype: string
  - name: title
    dtype: string
  - name: authors
    dtype: string
  splits:
  - name: train
    num_bytes: 80524
    num_examples: 57
  download_size: 55180
  dataset_size: 80524
configs:
- config_name: default
  data_files:
  - split: train
    path: data/train-*
license: cc-by-sa-4.0
language:
- en
pretty_name: ArXivMath August 2026
size_categories:
- n<1K
task_categories:
- question-answering
tags:
- math
- reasoning
- benchmark
- arxiv
---

# ArXivMath August 2026

## Homepage and repository

- **Homepage:** [MathArena](https://matharena.ai/)
- **Repository:** [MathArena evaluation code](https://github.com/eth-sri/matharena)
- **Benchmark description and prompts:** [August benchmark update](https://matharena.ai/arxiv_august/)

## Dataset summary

This dataset contains 57 self-contained research-level mathematics questions derived from arXiv papers submitted in August 2026. It is the August release of ArXivMath, used for the MathArena leaderboard. Each question asks for a final mathematical answer supported by its source paper.

The August generation pipeline prioritizes results resolving or refuting prior conjectures and open questions. Candidates were generated and reviewed with LLMs, then selected and edited through human curation. The release includes 25 questions derived from prior conjectures; the remaining questions concern other research results.

## Data fields

- `problem_idx` (`int64`): Problem index within this benchmark, starting at 1.
- `answer` (`string`): Gold final answer, usually expressed in LaTeX.
- `problem` (`string`): Solver-facing mathematical question, usually stored as LaTeX source.
- `source` (`string`): arXiv identifier of the source paper.
- `title` (`string`): Title of the source arXiv paper.
- `authors` (`string`): Authors of the source arXiv paper.

## Dataset split and loading

The dataset contains a single `train` split with **57 questions**. The split name follows the MathArena distribution convention; these questions are intended for evaluation.

```python
from datasets import load_dataset

dataset = load_dataset("MathArena/arxivmath-0826", split="train")
print(dataset[0]["problem"])
```

While the repository is private, loading requires a Hugging Face account with access and authentication, for example via `hf auth login`.

## Evaluation

Models receive the problem statement and are asked to produce a final answer. An LLM judge checks mathematical equivalence to the reference answer, rather than requiring identical strings. Scores are binary at the individual-answer level. The August harness evaluation allows coding tools without internet access and uses a 12-hour time limit and a $100 model-cost budget per attempt, with up to five minutes for a final answer after reaching the cost budget, within the original time limit.

For evaluation, supply only the `problem` field and the appropriate solver instructions. Keep reference answers or true statements and source-paper metadata out of the solver prompt.

## Licensing information

This dataset is licensed under [Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/), following the other MathArena ArXiv benchmarks. Source papers are credited in the `source`, `title`, and `authors` fields.

## Citation information

```bibtex
@article{dekoninck2026matharena,
      title={Beyond Benchmarks: MathArena as an Evaluation Platform for Mathematics with LLMs},
      author={Jasper Dekoninck and Nikola Jovanović and Tim Gehrunger and Kári Rögnvaldsson and Ivo Petrov and Chenhao Sun and Martin Vechev},
      year={2026},
      eprint={2605.00674},
      archivePrefix={arXiv},
      primaryClass={cs.CL},
      url={https://arxiv.org/abs/2605.00674},
}
```
