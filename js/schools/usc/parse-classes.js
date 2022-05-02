window.addEventListener('load', waitForTabs, false)

function waitForTabs() {
  /* Waits for tabs to load on page */
  const tabs = document.querySelector('.courses-data > .tabs')

  if (tabs) {
    parseClasses()
  } else {
    setTimeout(waitForTabs, 100)
  }
}

function parseClasses() {
  /* Parses all classes from all the terms available on my.usc.edu */
  
  // Get all the terms by looking at the href of the tab elements
  const terms = [...document.querySelector('.courses-data > .tabs').children].map(tab => {
    const href = tab.children[0].href
    return href.substring(href.lastIndexOf('#')+1)
  })

  const classes = {}
  for (const termId of terms) {
    // Check if term exists in html
    const termHTML = document.getElementById(termId)
    if (!termHTML) continue

    classes[termId] = []
    const classesHTML = termHTML.querySelector('.list').children

    // Iterate through the user's classes
    for (const c of classesHTML) {
      let course, sections

      // Find the child that contains data about the course
      for (const child of c.children) {
        if (child.dataset.hasOwnProperty('course') && child.dataset.hasOwnProperty('sections')) {
          course = child.dataset.course
          sections = child.dataset.sections
          break
        }
      }

      // If we couldn't find course or sections
      if (!course || !sections) continue
      
      // Format course id and sections
      const courseSplit = course.split(' ')
      const courseId = `${courseSplit[0]}-${courseSplit[1]}`
      const sectionsSplit = sections.split(',')
      const _class = {
        courseId,
        mainSection: sectionsSplit[0],
        otherSections: sectionsSplit.slice(1, sectionsSplit.length),
      }

      classes[termId].push(_class)
    }
  }

  console.log(classes)
}