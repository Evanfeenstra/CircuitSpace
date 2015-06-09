console.log('hi iframejs')



var html_editor = document.querySelector('#html textarea'),
    css_editor = document.querySelector('#css textarea'),
    js_editor = document.querySelector('#js textarea');
 
var editors = [html_editor, css_editor, js_editor];
 
// Attaching the onkeyup Event
editors.forEach(function(editor, i, arr) {
 
    editor.addEventListener('keyup', function() {
 
        // The function that'll prepare the code and inject
        // into the iframe.
        render();
 
    }, false);
 
});



// Base template
var base_tpl =
    "<!doctype html>\n" +
    "<html>\n\t" +
    "<head>\n\t\t" +
    "<meta charset=\"utf-8\">\n\t\t" +
    "<title>Circuit Space</title>\n\n\t\t\n\t" +
    "</head>\n\t" +
    "<body>\n\t\n\t" +
    "</body>\n" +
    "</html>";
 
var prepareSource = function() {
    var html = html_editor.value,
        css = css_editor.value,
        jsy = js_editor.value,
        src = '';
 
    // HTML
    src = base_tpl.replace('</body>', html + '</body>');
 
    // CSS
    css = '<style>' + css + '</style>';
    src = src.replace('</head>', css + '</head>');
 
    // Javascript
    jsy = '<script>' + jsy + '</script>';
    src = src.replace('</body>', jsy + '</body>');
 
    return src;
};





var render = function() {
    var source = prepareSource();
 
    var iframe = document.querySelector('#output iframe'),
        iframe_doc = iframe.contentDocument;
 
    iframe_doc.open();
    iframe_doc.write(source);
    iframe_doc.close();
};
