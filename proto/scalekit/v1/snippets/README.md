# Code Snippets

This directory contains code samples for the ScaleKit API v1. Each subdirectory corresponds to a proto file, and each markdown file contains code samples for a specific RPC method.

## Directory Structure

```
snippets/
├── README.md                           # This documentation file
├── organizations/                      # Corresponds to organizations.proto
│   ├── CreateOrganization.snippets.md # always use
│   ├── GetOrganization.snippets.md
│   └── UpdateOrganization.snippets.md
├── auth/                              # Corresponds to auth.proto
│   ├── Login.snippets.md
│   ├── Logout.snippets.md
│   └── VerifyPasswordlessEmail.snippets.md
└── users/                             # Corresponds to users.proto
    └── CreateUser.snippets.md
```

## File Naming Convention

- **Directory names**: Match the proto file names (without `.proto` extension)
- **File names**: `{RPCMethodName}.snippets.md`
- **Content format**: Markdown with code blocks for different languages

## Code Block Format

Each `.snippets.md` file should contain code samples in this format:

### Simple Format

```javascript
// JavaScript/Node.js code
```

```python
# Python code
```

```go
// Go code
```

```java
// Java code
```

### TabItem Format (for complex examples)

<TabItem value="nodejs">
```js
// JavaScript/Node.js code
```
</TabItem>

<TabItem value="py">
```python
# Python code
```
</TabItem>

<TabItem value="golang">
```go
// Go code
```
</TabItem>

<TabItem value="java">
```java
// Java code
```
</TabItem>

## Scripts Overview

The following scripts are available in `scripts/snippets/` for managing code snippets:

### 1. `code_sample_extractor.py`

Extracts code samples from markdown files and formats them into protobuf extensions.

**Usage:**

```bash
python3 scripts/snippets/code_sample_extractor.py <markdown_file> [--print-width WIDTH]
```

**Example:**

```bash
python3 scripts/snippets/code_sample_extractor.py proto/scalekit/v1/snippets/organizations/CreateOrganization.snippets.md --print-width 60
```

### 2. `process_all_snippets.py`

Lists and processes all snippet files in the proto snippets directory.

**Usage:**

```bash
python3 scripts/snippets/process_all_snippets.py [--list] [--extract-all] [--proto-file FILE]
```

**Examples:**

```bash
# List all available snippets
python3 scripts/snippets/process_all_snippets.py --list

# Extract all snippets
python3 scripts/snippets/process_all_snippets.py --extract-all

# Find snippets for a specific proto file
python3 scripts/snippets/process_all_snippets.py --proto-file organizations.proto
```

### 3. `inject_snippets_to_proto.py`

Injects code snippets from markdown files into corresponding proto files.

**Usage:**

```bash
python3 scripts/snippets/inject_snippets_to_proto.py [--dry-run] [--snippet-file FILE] [--proto-file FILE]
python3 scripts/snippets/inject_snippets_to_proto.py --all [--dry-run]
```

**Examples:**

```bash
# Process a single snippet file
python3 scripts/snippets/inject_snippets_to_proto.py --snippet-file proto/scalekit/v1/snippets/organizations/SearchOrganization.snippets.md

# Process all snippets
python3 scripts/snippets/inject_snippets_to_proto.py --all

# Dry-run to see what would be done
python3 scripts/snippets/inject_snippets_to_proto.py --all --dry-run
```

## Complete Workflow

### 1. Create Snippet Files

Create a new markdown file in the correct location:

```bash
mkdir -p proto/scalekit/v1/snippets/{service_name}
touch proto/scalekit/v1/snippets/{service_name}/{RPCMethodName}.snippets.md
```

Add your code examples in markdown format using language-specific code blocks as shown in the Code Block Format section above.

### 2. Test Your Snippet File

Use `code_sample_extractor.py` to verify your snippet formatting:

```bash
python3 scripts/snippets/code_sample_extractor.py proto/scalekit/v1/snippets/{service_name}/{RPCMethodName}.snippets.md
```

This will show you how the snippets will be formatted as protobuf extensions.

### 3. Check Available Snippets

Use `process_all_snippets.py` to list all available snippets:

```bash
python3 scripts/snippets/process_all_snippets.py --list
```

This helps verify that your new snippet file is detected correctly.

### 4. Inject Snippets into Proto Files

For a single snippet file:

```bash
python3 scripts/snippets/inject_snippets_to_proto.py --snippet-file proto/scalekit/v1/snippets/{service_name}/{RPCMethodName}.snippets.md
```

For all snippets at once:

```bash
python3 scripts/snippets/inject_snippets_to_proto.py --all
```

Use `--dry-run` flag to preview changes:

```bash
python3 scripts/snippets/inject_snippets_to_proto.py --all --dry-run
```

## Running Scripts

### From Project Root

To run these scripts from the project root directory (`/Users/saif/Projects/scalekit-docs/apis/`):

```bash
# From /Users/saif/Projects/scalekit-docs/apis/
python3 scripts/snippets/inject_snippets_to_proto.py --all
python3 scripts/snippets/process_all_snippets.py --list
python3 scripts/snippets/code_sample_extractor.py scripts/snippets/play.md
```

### From Scripts Directory

You can also run the scripts from within the `scripts/snippets/` directory:

```bash
cd scripts/snippets/
python3 inject_snippets_to_proto.py --all
python3 process_all_snippets.py --list
python3 code_sample_extractor.py play.md
```

**Note:** The scripts automatically detect their location and use the correct paths for both scenarios.

## Advanced Usage

### Large-Scale Changes

For large-scale changes:

1. First use `--list` to see all available snippets:

   ```bash
   python3 scripts/snippets/process_all_snippets.py --list
   ```

2. Then use `--extract-all` to process all snippets at once:

   ```bash
   python3 scripts/snippets/process_all_snippets.py --extract-all
   ```

3. Finally use `--all` with `inject_snippets_to_proto.py` to update all proto files:
   ```bash
   python3 scripts/snippets/inject_snippets_to_proto.py --all
   ```

### Working with Specific Proto Files

```bash
# Find snippets for a specific proto file
python3 scripts/snippets/process_all_snippets.py --proto-file organizations.proto

# Inject snippets into a specific proto file
python3 scripts/snippets/inject_snippets_to_proto.py --proto-file path/to/your.proto
```


## Versioning

This directory is versioned alongside the proto files. When creating a new API version (e.g., v2), create a corresponding `proto/scalekit/v2/snippets/` directory.

## Next Steps

1. **Add more snippet files** for other RPC methods
2. **Integrate with your build process** to automatically inject snippets into proto files
3. **Consider adding validation** to ensure snippet files follow the correct format
4. **Add CI/CD checks** to verify all RPC methods have corresponding snippets
