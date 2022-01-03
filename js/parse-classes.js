/* Constants */
const parseBtn = document.getElementById('parse-btn')
const parsedClasses = document.getElementById('parsed-classes')

/* Function definitions */
function parseClasses() {
  // TODO: get the term from the user's currently selected term (maybe a dropdown in popup.html?)
  const term = '20221'

  const classes = []
  const classesHTML = document.getElementById(`term-${term}`).querySelector('.list').children

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

    classes.push(_class)
  }

  //console.log(classes)

  chrome.runtime.sendMessage({ type: 'parse-classes', classes })
}

/* Event listeners */
parseBtn.addEventListener('click', async () => {
  let [ tab ] = await chrome.tabs.query({ active: true, currentWindow: true })

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: parseClasses,
  })
})

chrome.runtime.onMessage.addListener((message) => {
  console.log('MESSAGE: ', message)
  switch (message.type) {
    case 'parse-classes':
      for (const c of message.classes) {
        parsedClasses.innerHTML += `<li>Course ID: ${c.courseId}, Section ${c.mainSection}</li>`
      }
      break
  }

})