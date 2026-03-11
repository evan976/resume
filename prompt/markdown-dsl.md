# Markdown DSL Prompt

You are editing `src/resume.md` in **Vitae**. The file uses standard Markdown extended with two plugins that form a lightweight layout DSL.

## Active Plugins

| Plugin | Purpose |
|---|---|
| `markdown-it-container` | Creates `<div>` wrappers from `:::` / `::::` fences with optional HTML attributes |
| `markdown-it-attrs` | Attaches HTML attributes (`id`, `class`, `data-*`, `style`) to any Markdown element via `{...}` |
| `markdown-it-imsize` | Supports `![alt](url =WxH)` image syntax for explicit dimensions |

---

## Container Syntax

```markdown
:::: {.class-name}   ← outer container (4 colons = nesting level)

::: {.inner-class}   ← inner container (3 colons)

Content here

:::

::::
```

Renders to:
```html
<div class="class-name">
  <div class="inner-class">
    <p>Content here</p>
  </div>
</div>
```

Use more colons (`::::`) for outer containers and fewer (`:::`) for inner ones to avoid ambiguous closing.

---

## Attribute Syntax (`markdown-it-attrs`)

Attach `{...}` **immediately after** the element on the same line:

```markdown
# Zhang San {.name}               → <h1 class="name">Zhang San</h1>

**Job Target: Frontend** {.target} → <strong class="target">...</strong>

- item 1
- item 2
{.list}                            → <ul class="list">...</ul>

## Section Header {#skills}        → <h2 id="skills">...</h2>

## Self-Assessment {data-print style="--print-padding: 50px 0 0 0"}
```

Supported attribute types: `.class`, `#id`, `key=value`, `data-*`, `style="..."`.

---

## Document Structure

The resume is divided into two top-level containers that map to CSS layout classes:

```markdown
:::: {.basic-info}
  ← Name, job target, contact list
::::

:::: {.main-content}
  ← All sections: skills, work experience, projects, education, summary
::::
```

### Inside `.basic-info`

```markdown
:::: {.basic-info}

::: {.left}

# Your Name {.name}

**Job Target: Role** {.target}

- **Phone:** 138xxxx8888
- **Email:** you@example.com

{.list}

:::

::::
```

### Inside `.main-content`

Use `## Heading` for section headers and `### Heading` for sub-items (companies, projects).

```markdown
## Work Experience

### Company Name

**Role:** Frontend Engineer

**Period:** 2022.06 – Present

- Responsibility one
- Responsibility two
```

### Education Section

Wrap in `{.education}` to get the two-column (name / date) layout:

```markdown
::: {.education}

**University Name**
**Major**
**Degree**
**2016.09 – 2020.06**

:::
```

---

## Print-Only Padding

Use `data-print` + inline `style` to add extra spacing for PDF page breaks:

```markdown
## Self-Assessment {data-print style="--print-padding: 50px 0 0 0"}
```

---

## Rules

- Do not add custom HTML directly — use the container/attrs DSL instead.
- Nesting depth: use `::::` for the outermost wrapper, `:::` for inner sections.
- The `.list` class must be attached to the `ul` element's closing line (the `{.list}` after the last `li`).
- Keep the two top-level containers (`.basic-info` and `.main-content`) — the CSS depends on them.
