const fs = require("fs");
const path = require("path");

function inlineProjectIncludes(source, currentFile, seen = new Set()) {
  return source.replace(/#include\s+([.]{1,2}\/[^\s]+)/g, (match, includePath) => {
    const resolved = path.resolve(path.dirname(currentFile), includePath);

    if (seen.has(resolved)) {
      return "";
    }

    const nextSeen = new Set(seen);
    nextSeen.add(resolved);

    const includedSource = fs.readFileSync(resolved, "utf8");
    return inlineProjectIncludes(includedSource, resolved, nextSeen);
  });
}

module.exports = function glslIncludeLoader(source) {
  const resolved = inlineProjectIncludes(source, this.resourcePath);
  return `export default ${JSON.stringify(resolved)};`;
};
