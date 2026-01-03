# Multilingual Content Maintenance Guide

This guide provides comprehensive instructions for maintaining multilingual content in our Next.js application. It covers database structure, form handling, language addition, common issues, and best practices to ensure consistent and error-free multilingual support.

## Database Structure

Our multilingual content is stored using separate translation tables for each content type. This approach allows for efficient querying and maintains referential integrity.

### Project Translations

Project translations use a dedicated table structure:

```sql
CREATE TABLE project_translations (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  locale VARCHAR(10) NOT NULL,
  title TEXT,
  description TEXT,
  content JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, locale)
);
```

- **project_id**: References the main project record
- **locale**: ISO language code (e.g., 'en', 'fr', 'ar')
- **title, description**: Translated text fields
- **content**: JSONB field for structured content blocks

### Blog Post Translations

Blog translations follow a similar pattern with an additional table:

```sql
CREATE TABLE blog_translations (
  id SERIAL PRIMARY KEY,
  blog_post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
  locale VARCHAR(10) NOT NULL,
  title TEXT,
  excerpt TEXT,
  content TEXT,
  slug TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(blog_post_id, locale)
);
```

Key considerations:
- Use `UNIQUE(project_id, locale)` constraints to prevent duplicate translations
- JSONB fields provide flexibility for complex content structures
- Timestamps track creation and modification for auditing

## Form Handling

The admin interface uses multi-language tabs for content editing. Components like [`MultiLanguageContentBlockManager.jsx`](components/Blocks/MultiLanguageContentBlockManager.jsx) and [`ProjectForm.jsx`](components/admin/projects/ProjectForm.jsx) implement this pattern.

### Multi-Language Tab Implementation

```jsx
// Example from MultiLanguageContentBlockManager.jsx
const [activeLanguage, setActiveLanguage] = useState('en');

const handleLanguageChange = (lang) => {
  setActiveLanguage(lang);
  // Save current tab data before switching
  saveCurrentTabData();
};
```

### Form Submission

Forms handle multiple languages by collecting data in a structured format:

```javascript
// Example data structure sent to API
const formData = {
  en: { title: 'English Title', content: 'English content...' },
  fr: { title: 'Titre Français', content: 'Contenu français...' },
  ar: { title: 'العنوان العربي', content: 'المحتوى العربي...' }
};
```

Key points:
- Always validate all language fields before submission
- Use language-specific validation rules (e.g., RTL text handling for Arabic)
- Implement auto-save to prevent data loss during tab switching

## Adding New Languages

To add support for a new language, follow these steps:

### 1. Update i18n Configuration

Add the new locale to [`app/i18n.js`](app/i18n.js):

```javascript
export const locales = ['en', 'fr', 'ar', 'es']; // Add 'es' for Spanish
export const defaultLocale = 'en';
```

### 2. Create Message Files

Create a new JSON file in the [`messages/`](messages/) directory:

```bash
cp messages/en.json messages/es.json
```

Edit the new file with Spanish translations:

```json
{
  "nav.home": "Inicio",
  "nav.about": "Acerca de",
  // ... other translations
}
```

### 3. Update Routing

Ensure the new locale is handled in [`i18n/routing.js`](i18n/routing.js) for URL generation.

### 4. Database Preparation

Run migration scripts to add the new locale to existing translation tables:

```sql
INSERT INTO project_translations (project_id, locale)
SELECT id, 'es' FROM projects WHERE NOT EXISTS (
  SELECT 1 FROM project_translations 
  WHERE project_id = projects.id AND locale = 'es'
);
```

### 5. Update Components

Modify language switcher components like [`LanguageSwitcher.jsx`](components/LanguageSwitcher.jsx) to include the new option.

## Common Pitfalls and Fixes

### Double-Encoded URLs

**Issue**: URLs containing special characters get encoded multiple times, breaking links.

**Cause**: Improper encoding in form submissions or API responses.

**Fix**: Use consistent encoding/decoding. Reference the recent fix in [`fix-double-encoded-urls.js`](fix-double-encoded-urls.js):

```javascript
// Decode once at the source
const decodedUrl = decodeURIComponent(encodedUrl);
```

**Prevention**: Always decode URLs before storing or displaying them.

### Missing Translations

**Issue**: Content displays in default language when translation is missing.

**Symptom**: Fallback to English text in non-English locales.

**Fix**: Implement proper fallback mechanisms:

```javascript
const getTranslation = (key, locale) => {
  return translations[locale]?.[key] || translations['en'][key] || key;
};
```

### Slug Conflicts

**Issue**: Duplicate slugs across languages cause routing conflicts.

**Fix**: Include locale in slug generation for unique identification.

### Character Encoding Issues

**Issue**: Special characters (é, ñ, Arabic text) display incorrectly.

**Fix**: Ensure UTF-8 encoding throughout the application stack:
- Database: Set charset to UTF-8
- API responses: Include `Content-Type: application/json; charset=utf-8`
- HTML: Use `<meta charset="utf-8">`

## Best Practices

### 1. Consistent Naming Conventions

- Use ISO 639-1 language codes (en, fr, ar)
- Follow kebab-case for translation keys: `nav.home`, `form.submit`

### 2. Translation Key Organization

Group related keys logically:

```json
{
  "nav": {
    "home": "Home",
    "about": "About"
  },
  "form": {
    "submit": "Submit",
    "cancel": "Cancel"
  }
}
```

### 3. Validation and Sanitization

- Validate text length limits per language
- Sanitize HTML content to prevent XSS
- Implement RTL support for right-to-left languages

### 4. Performance Optimization

- Cache translated content to reduce database queries
- Use lazy loading for translation files
- Implement efficient querying with proper indexes on locale columns

### 5. Testing Strategy

- Test all language variants for each feature
- Verify RTL layout in Arabic/Hebrew interfaces
- Check for missing translation keys in CI/CD pipelines

### 6. Content Management Workflow

- Establish clear ownership for translations per language
- Use version control for translation files
- Implement review processes for translation quality

### 7. Monitoring and Maintenance

- Monitor for missing translations in production
- Set up alerts for translation key mismatches
- Regularly audit translation completeness

By following this guide, you can maintain high-quality multilingual content efficiently while avoiding common issues. Always refer to the referenced files for implementation details and update this guide as the system evolves.