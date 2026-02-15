# Quickstart: Maintaining REFERENCE.md

## When to Update

Update REFERENCE.md when:
- A new public method is added to any domain client
- A method signature changes (parameters, types, return type)
- A method is deprecated or removed
- A new domain client is added

## How to Add a New Method Entry

1. Identify which domain section the method belongs to.
2. Copy the method entry template from data-model.md.
3. Fill in:
   - Method signature (copy exactly from source)
   - Description (what it does, when to use it)
   - Usage example (must include import, init, and invocation)
   - Parameter table (all params with types and required/optional)
   - Return type description
   - Source link (absolute GitHub URL to `main` branch)
4. Place the entry within the correct domain section.

## Validation Checklist

Before merging REFERENCE.md changes:
- [ ] Every method signature matches the source code exactly
- [ ] All code examples are valid TypeScript
- [ ] All source links use absolute GitHub URLs to `main` branch
- [ ] Required vs optional parameters are correctly marked
- [ ] New methods are placed in the correct domain section
- [ ] Table of contents links work

## File Location

- Repository root: `REFERENCE.md`
- Included in npm package via package.json files list
