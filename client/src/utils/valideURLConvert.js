export const valideURLConvert = (name) => {
    if (!name) return ""
    return name
        .toString()
        .replace(/[^a-zA-Z0-9\s-]/g, '') // strip special URL characters like # ? % / @ etc.
        .trim()
        .replace(/\s+/g, '-') // convert spaces to hyphens
        .toLowerCase()
}