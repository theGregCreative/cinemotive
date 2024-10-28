# CineMotive

A web application for managing customer video content and metadata, with robust file tracking and deployment validation.

## 🚀 Project Structure
```
📁 root/
   📁 src/
      📁 config/
         ⚡ google-drive.js  # Google Drive API configuration
      📁 routes/
         🔌 upload.js       # File upload route handlers
   📁 public/              # Static files
   📁 meta/
      📁 scripts/
         ⚡ allTheScripts.js  # File content backup script
         ⚡ hierarchy.js      # Project structure analyzer
      📁 data/              # Generated backups and hierarchies
   ⚡ index.js             # Express server setup
```

## 🛠️ Setup

1. Install dependencies:
```bash
npm install
```

2. Required dependencies:
- express: Web server framework
- multer: File upload handling
- googleapis: Google Drive API integration
- dotenv: Environment variable management

## 📊 Project Management Tools

### File Hierarchy Generator
Located in `meta/scripts/hierarchy.js`, this tool:
- Creates a detailed project structure visualization
- Tracks file sizes and modifications
- Generates MD5 hashes for file integrity
- Outputs timestamped reports to `meta/data/`

Run it with:
```bash
node meta/scripts/hierarchy.js
```


### Content Backup System
Located in `meta/scripts/allTheScripts.js`, this tool:
- Backs up all tracked file content
- Excludes binary and special files
- Creates timestamped backups in `meta/data/`

Run it with:
```bash
node meta/scripts/allTheScripts.js
```

## 🔍 File Tracking

The project includes sophisticated file tracking:
- MD5 hashes for file integrity validation
- Timestamped backups for change tracking
- Detailed file metadata including:
  - File sizes
  - Last modified dates
  - Content hashes
  - File type statistics

## 🚀 Development

Start the development server:
```bash
npm run dev
```

This will run the server with nodemon for auto-reloading.

## 📦 Deployment

The project uses file hashing for deployment validation:
- Each file has a unique MD5 hash
- Hashes can be used to verify file integrity
- Deployment manifests can be generated from the hierarchy tool

## 🔒 Environment Variables

Required environment variables:
```env
PORT=3000
# Add other environment variables as needed
```

## 📝 Scripts

- `npm start`: Start the production server
- `npm run dev`: Start development server with nodemon
- `node meta/scripts/hierarchy.js`: Generate project structure report
- `node meta/scripts/allTheScripts.js`: Create content backup

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📄 License

ISC License

## 🌑 The Dark Council

The project is overseen by a powerful Dark Council, residing in `meta/scripts/`:

```
📁 meta/scripts/
   ⚜️ hashImperator.js        # The Supreme Dark Lord - Orchestrates all hash operations
   📚 darkArchives.js         # Master of Holocrons - Creates detailed backups
   
   📁 tools/                  # The Dark Council's Inner Sanctum
      ⚔️ hashInquisitor.js    # Forges dark signatures for local files
      🌐 gitHubInfiltrator.js # Extracts hash essences from GitHub
      ⚖️ hashAdjudicator.js   # Passes judgment on file integrity
```

### 🦹 Dark Powers

Each member of the council wields specific dark powers:

#### The Supreme Dark Lord (hashImperator.js)
- Orchestrates the triumvirate of hash validation
- Commands the Hash Inquisitor for local signatures
- Dispatches the GitHub Infiltrator for remote essences
- Summons the Hash Adjudicator for final judgment

#### Master of Holocrons (darkArchives.js)
- Creates timestamped holocrons of the codebase
- Measures the power of each artifact
- Chronicles modifications and hierarchies
- Preserves the essence of each file

#### The Inner Sanctum (tools/)
- **Hash Inquisitor**: Forges unique MD5 signatures
- **GitHub Infiltrator**: Extracts hash essences from GitHub
- **Hash Adjudicator**: Passes judgment on file integrity

### 🚀 Summoning the Dark Council

```bash
# Initiate the grand ritual of hash validation
node meta/scripts/hashImperator.js

# Create holocrons of the codebase
node meta/scripts/darkArchives.js
```

### 📜 Dark Artifacts

All operations produce sacred artifacts in `meta/data/`:
- Hash validation reports
- File integrity judgments
- Codebase holocrons
- Hierarchical dark maps
