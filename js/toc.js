/**
 * Table of Contents Generator and Active Section Tracker
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get elements
  var articleContent = document.getElementById('article-content');
  var tocNav = document.getElementById('toc-nav');
  
  if (!articleContent || !tocNav) {
    console.log('TOC: article-content or toc-nav not found');
    return;
  }
  
  // Get all headings (h2, h3)
  var headings = articleContent.querySelectorAll('h2[id], h3[id]');
  
  if (headings.length === 0) {
    // Hide TOC if no headings
    var tocSidebar = document.querySelector('.toc-sidebar');
    if (tocSidebar) tocSidebar.style.display = 'none';
    return;
  }
  
  // Generate TOC HTML
  var tocHTML = '<ul>';
  
  headings.forEach(function(heading) {
    var id = heading.id;
    var text = heading.textContent;
    var level = heading.tagName.toLowerCase();
    var levelClass = level === 'h2' ? 'level-2' : 'level-3';
    
    tocHTML += '<li><a href="#' + id + '" class="toc-link ' + levelClass + '" data-target="' + id + '">' + text + '</a></li>';
  });
  
  tocHTML += '</ul>';
  tocNav.innerHTML = tocHTML;
  
  // Get all TOC links
  var tocLinks = tocNav.querySelectorAll('.toc-link');
  
  // Smooth scroll when clicking TOC links
  tocLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      var targetId = this.getAttribute('data-target');
      var targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        var header = document.querySelector('.header');
        var headerHeight = header ? header.offsetHeight : 0;
        var targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL hash without jumping
        history.pushState(null, null, '#' + targetId);
      }
    });
  });
  
  // Track active section on scroll
  function updateActiveSection() {
    var scrollPosition = window.scrollY;
    var header = document.querySelector('.header');
    var headerHeight = header ? header.offsetHeight : 0;
    var offset = headerHeight + 100;
    
    var currentSection = null;
    
    // Find the current section
    headings.forEach(function(heading) {
      var headingTop = heading.getBoundingClientRect().top + window.scrollY - offset;
      
      if (scrollPosition >= headingTop) {
        currentSection = heading.id;
      }
    });
    
    // Update active link
    tocLinks.forEach(function(link) {
      link.classList.remove('active');
      if (link.getAttribute('data-target') === currentSection) {
        link.classList.add('active');
        
        // Scroll TOC to keep active link visible
        var tocContainer = document.querySelector('.toc-container');
        if (tocContainer) {
          var linkRect = link.getBoundingClientRect();
          var containerRect = tocContainer.getBoundingClientRect();
          
          if (linkRect.top < containerRect.top || linkRect.bottom > containerRect.bottom) {
            link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      }
    });
  }
  
  // Throttled scroll handler
  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateActiveSection();
        ticking = false;
      });
      ticking = true;
    }
  });
  
  // Initial check
  updateActiveSection();
  
  // Handle initial hash in URL
  if (window.location.hash) {
    var hash = window.location.hash.substring(1);
    var targetElement = document.getElementById(hash);
    if (targetElement) {
      setTimeout(function() {
        var header = document.querySelector('.header');
        var headerHeight = header ? header.offsetHeight : 0;
        var targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'auto'
        });
      }, 100);
    }
  }
});
