function slugify(inputText) {
    if (!inputText) {
        return null
    }
    return inputText.replace(" ", "-").toLowerCase().trim()
}