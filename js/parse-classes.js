/* Constants */
const parseBtn = document.getElementById('parse-btn')
const parsedClasses = document.getElementById('parsed-classes')

/* Function definitions */
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('MESSAGE: ', message)
  switch (message.type) {
    case 'parse-classes':
      for (const term of Object.keys(message.classes)) {
        parsedClasses.innerHTML += `<h3>${term}</h3>`
        for (const c of message.classes[term]) {
          parsedClasses.innerHTML += `<li>Course ID: ${c.courseId}, Section ${c.mainSection}, Other sections: ${c.otherSections}</li>`
        }
      }
      break
  }
  sendResponse(true)
})

/*

chrome.tabs.onActivated.addListener(({ tabId }) => {
  window.activeTabId = tabId
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    tabId === window.activeTabId &&
    changeInfo.url &&
    changeInfo.url === step1Data[window.userData.school].url
  ) {
    console.log('YES')
    step1.innerHTML = 'DONE'
  }
})
*/

/* Onload */
/*
chrome.tabs.query({ active: true, currentWindow: true }).then(({ id, url }) => {
  window.activeTabId = id

  if (url === step1Data['usc'].url) {
    console.log('YES')
    // This doesn't work because it's being overridden by the stuff in auth.js once user data is updated 
    document.getElementById('step-1').innerHTML = 'DONE'
  }
})
*/