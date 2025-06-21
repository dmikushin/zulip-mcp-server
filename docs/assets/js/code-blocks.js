/**
 * Enhanced Code Blocks with Copy Functionality
 * Compatible with GitHub Pages Jekyll
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCodeBlocks);
  } else {
    initCodeBlocks();
  }

  function initCodeBlocks() {
    // Find all code blocks
    const codeBlocks = document.querySelectorAll('pre > code, div.highlight > pre');
    
    codeBlocks.forEach(function(codeBlock) {
      const pre = codeBlock.tagName === 'PRE' ? codeBlock : codeBlock.parentElement;
      if (!pre) return;
      
      // Skip if already processed
      if (pre.parentElement.classList.contains('code-block-enhanced')) return;
      
      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-enhanced';
      
      // Insert wrapper
      pre.parentElement.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      
      // Add copy button
      addCopyButton(wrapper, codeBlock);
      
      // Add language label if available
      addLanguageLabel(wrapper, codeBlock);
    });
  }

  function addCopyButton(wrapper, codeElement) {
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="m5 15-4-4 4-4"></path><path d="M5 15H2a2 2 0 01-2-2V2a2 2 0 012-2h11a2 2 0 012 2v3"></path></svg> Copy';
    copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
    
    // Position the button
    wrapper.style.position = 'relative';
    wrapper.appendChild(copyBtn);
    
    // Add click handler
    copyBtn.addEventListener('click', function() {
      copyCodeToClipboard(codeElement, copyBtn);
    });
  }

  function addLanguageLabel(wrapper, codeElement) {
    // Try to detect language from class names
    const classes = codeElement.className || '';
    const langMatch = classes.match(/language-(\w+)|highlight-(\w+)|(\w+)/) || 
                     codeElement.parentElement.className.match(/language-(\w+)|highlight-(\w+)/);
    
    if (langMatch) {
      const language = langMatch[1] || langMatch[2] || langMatch[3];
      if (language && language !== 'highlight' && language !== 'code') {
        const langLabel = document.createElement('span');
        langLabel.className = 'language-label';
        langLabel.textContent = language.toUpperCase();
        wrapper.appendChild(langLabel);
      }
    }
  }

  function copyCodeToClipboard(codeElement, button) {
    // Get the text content
    const code = codeElement.textContent || codeElement.innerText;
    
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(function() {
        showCopyFeedback(button, true);
      }).catch(function() {
        // Fallback to execCommand
        fallbackCopy(code, button);
      });
    } else {
      // Fallback for older browsers
      fallbackCopy(code, button);
    }
  }

  function fallbackCopy(text, button) {
    // Create temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      const successful = document.execCommand('copy');
      showCopyFeedback(button, successful);
    } catch (err) {
      showCopyFeedback(button, false);
    }
    
    document.body.removeChild(textarea);
  }

  function showCopyFeedback(button, success) {
    const originalHTML = button.innerHTML;
    
    if (success) {
      button.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"></polyline></svg> Copied!';
      button.classList.add('copied');
    } else {
      button.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg> Failed';
      button.classList.add('error');
    }
    
    // Reset after 2 seconds
    setTimeout(function() {
      button.innerHTML = originalHTML;
      button.classList.remove('copied', 'error');
    }, 2000);
  }

  // Initialize on any dynamic content changes
  if (window.MutationObserver) {
    const observer = new MutationObserver(function(mutations) {
      let shouldInit = false;
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === 1 && (node.tagName === 'PRE' || node.querySelector('pre'))) {
              shouldInit = true;
              break;
            }
          }
        }
      });
      
      if (shouldInit) {
        setTimeout(initCodeBlocks, 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();