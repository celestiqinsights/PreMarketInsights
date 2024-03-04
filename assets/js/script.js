$(document).ready(function () {
  $("#header").load("header.html");
  $("#main").load("main.html");
  $("#footer").load("footer.html");
  //checkContentPage();

  $("#footer").on("click", "a[data-anchor]", function (e) {
    e.preventDefault();

    var targetAnchor = $(this).data("anchor");

    // Check if data-anchor is available
    if (targetAnchor) {
      var targetUrl = targetAnchor + ".html"; // Assuming your HTML files have the same name as data-anchor values
      loadContent(targetUrl);
    } else {
      console.error("data-anchor attribute not found on the clicked link.");
    }
  });

  // Add smooth scrolling for header links
  $("#header").on("click", "a[href^='#']", function (e) {
    e.preventDefault();

    var targetSectionId = $(this).attr("href").substring(1); // Get the target section ID
    loadMainAndScrollToSection(targetSectionId);
  });

  // Function to update the active class based on scroll position
function updateActiveNav() {
  var scrollPosition = $(document).scrollTop();
  var headerHeight = $("#header").outerHeight(); // Get the height of the header

  var foundActive = false; // Flag to track if any section is in view

  // Loop through each navigation link and find the corresponding section
  $(".navbar-nav li[data-anchor]").each(function () {
    var sectionId = $(this).data("anchor");
    var section = $("#" + sectionId);

    if (section.length) {
      var sectionTop = section.offset().top - headerHeight - 100;
      var sectionBottom = sectionTop + section.outerHeight();

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        // This section is in view, update the active class
        $(".navbar-nav li").removeClass("active");
        $(this).addClass("active");

        foundActive = true;
      }
    }
  });

  // If no section is in view, remove the active class
  if (!foundActive) {
    $(".navbar-nav li").removeClass("active");
  }
}


  // Initial update on page load
  updateActiveNav();

  // Update on scroll
  $(window).scroll(function () {
    updateActiveNav();
  });

  // Function to load content into #main
  function loadContent(url) {
    $("#main").load(url, function () {
      setTimeout(function () {
        $("html, body").animate({
          scrollTop: $(".big-heading-section").offset().top - 100
        }, "slow");
      }, 500);
    });

    //checkContentPage();
  }
  

  // Function to load content into #main and scroll to section
  function loadMainAndScrollToSection(sectionId) {
    $("#main").load("main.html", function () {
      // After content is loaded, scroll to the specified section
      if ($("#" + sectionId).length) {
        $("html, body").animate({
          scrollTop: $("#" + sectionId).offset().top - 100
        }, "slow");
      } else {
        console.error("Section with ID " + sectionId + " not found.");
      }
    });

    //checkContentPage();
  }

  function submitForm() {
    // Remove existing error classes from all form elements
    $('.form-control').removeClass('error');

    showLoading();

    var formData = new FormData($('#contactForm')[0]);

    $.ajax({
      type: 'POST',
      url: 'contact-us.php',
      data: formData,
      processData: false,
      contentType: false,
      success: function (responseText) {
        setTimeout(function () {
          hideLoading();
          updateModal(responseText);
        }, 1000); // Adjust the delay as needed
      },
      error: function (xhr, textStatus, errorThrown) {
        hideLoading();

        // Handle the error here     
        try {
          var errorResponse = JSON.parse(xhr.responseText);
          if (errorResponse && errorResponse.error) {
            // Highlight the fields with errors
            for (var field in errorResponse.error) {
              $('#' + field).addClass('error');
            }
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    });
  }

  function showLoading() {
    $('.backdrop').show();
    $('#loadingIndicator').show();
  }

  function hideLoading() {
    $('#loadingIndicator').hide();
    $('.backdrop').hide();
  }

  function updateModal(responseText) {
    var modalMessageElement = $('#emailStatusMessage');
    if (modalMessageElement.length) {
      modalMessageElement.html(responseText);
      var emailStatus = $('#emailStatus');
      emailStatus.modal('show');
    } else {
      console.error('Element with ID emailStatusMessage not found.');
    }
  }

  $('#emailStatus').on('hidden.bs.modal', function () {
    $('#contactForm')[0].reset();
  });

  
  // function checkContentPage() {
  //   setTimeout(function () {
  //     if ($('#content-page').length > 0) {
  //       $('body').addClass('content-page-bg');
  //     } else {
  //       $('body').removeClass('content-page-bg');
  //     }
  //   }, 500); // Replace 500 with your desired delay in milliseconds    
  // }
});