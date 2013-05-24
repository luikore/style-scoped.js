$.applyScopedCss = ->
  return if 'scoped' in document.createElement('style')

  space = /\s*(\/\*.*?\*\/\s*)*/
  parse = (css) ->
    css = new $.applyScopedCss.StringScanner(css)
    hash = {}
    until css.hasTerminated()
      css.skip space
      selector = $.trim css.scanUntil /\{/
      selector = selector.slice 0, selector.length - 1
      style = css.scanUntil /\}/
      style = style.slice 0, style.length - 1
      hash[selector] = style
    hash

  change = (parent, e)->
    for selector, style of e.data('scoped')
      for c in parent.find(selector).add(parent.filter selector)
        c = $ c
        style += ';' + c.attr('style') if c.attr('style')
        c.attr 'style', style

  observerKlass = window.MutationObserver || window.WebKitMutationObserver
  $('style[scoped]').each (i, elem)->
    e = $ elem
    unless e.data('scoped')
      e.data 'scoped', parse(e.text())
      parent = e.parent()
      change parent, e
      e.text ''
      if observerKlass
        observer = new observerKlass((mutation, observer)->
          change parent, e
          undefined
        )
        observer.observe parent[0], {subtree: true, childList: false, attributes: false, characterData: true}
      undefined

exports = $.applyScopedCss
# strscan.coffee
