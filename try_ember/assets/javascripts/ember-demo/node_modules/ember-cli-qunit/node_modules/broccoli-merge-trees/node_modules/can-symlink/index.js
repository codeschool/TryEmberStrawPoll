var path = require('path');

module.exports = function testCanSymlink (options) {
  options = options || {};
  var fs = options.fs || require('fs');
  var os = options.os || require('os');
  var tmpdir = os.tmpdir();

  var canLinkSrc  = path.join(tmpdir, "canLinkSrc.tmp")
  var canLinkDest = path.join(tmpdir, "canLinkDest.tmp")

  try {
    fs.writeFileSync(canLinkSrc, '');
  } catch (e) {
    return false
  }

  try {
    fs.symlinkSync(canLinkSrc, canLinkDest)
  } catch (e) {
    fs.unlinkSync(canLinkSrc)
    return false
  }

  fs.unlinkSync(canLinkSrc)
  fs.unlinkSync(canLinkDest)

  return true
}