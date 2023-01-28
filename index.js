import args from 'args'
import colors from 'colors'

args
  .option("url", "The video url")

const { url } = args.parse(process.argv)

start()

async function start(){
  console.log(colors.bold(colors.rainbow("Y2MATE DOWNLOADER")))
  if(!url || typeof url !== 'string'){
    console.log(colors.red("Hey! You need to tell me the url of the video.") + colors.yellow(" Please add: --url [URL] to the end of the command."))
    return
  }
  console.log(colors.green("OK.") + " Give me a moment to check the URL and get information from it... (0/3)")
  const finalUrl = await getVideoDownloadUrl()
  console.log("")
  console.log(`${colors.bold(colors.green("ALL DONE!"))} Open up this link to download your video: ${colors.underline(colors.blue(finalUrl))}`)  
}

async function getVideoDownloadUrl(){
  const { id, formatId } = await analyzeUrl()
  const { getLinkUrl } = await convertUrl(id, formatId)
  const { finalUrl } = await getLink(getLinkUrl)
  return finalUrl
}

async function getLink(getLinkUrl){
  const response = await fetch(getLinkUrl, {
    method: 'GET',
    headers: {
      "Origin": "https://en.y2mate.is",
    }
  })
  const convertedResponse = await response.json()
  const finalUrl = convertedResponse.url
  console.log(colors.green("OK.") + " Conversion finished and I was able to grab the link (3/3)")
  return { 
    finalUrl
  }
}

async function convertUrl(id, formatId){
  const response = await fetch(`https://srv23.y2mate.is/convert?id=${id}&formatId=${formatId}`, {
    method: 'GET',
    headers: {
      "Origin": "https://en.y2mate.is",
    }
  })
  const convertedResponse = await response.json()
  const getLinkUrl = convertedResponse.url
  console.log(colors.green("OK.") + " The conversion started succesfully. (2/3)")
  console.log("Now just let me wait till its finished and grab the link for you. (2/3)")
  return { 
    getLinkUrl
  }
}

async function analyzeUrl(){
  const response = await fetch(`https://y2mate.is/analyze?url=${url}`, {
    method: 'GET',
    headers: {
      "Origin": "https://en.y2mate.is",
    }
  })
  const convertedResponse = await response.json()
  const { id } = convertedResponse.formats
  const lastVideoFormatIndex = convertedResponse.formats.video.length - 1
  const { formatId } = convertedResponse.formats.video[lastVideoFormatIndex]

  console.log(colors.green("OK.") + " The url seems fine and I got useful information from it. (1/3)")
  console.log("Now give me a moment to start the convertion of this video... (1/3)")
  return {
    id, formatId
  }
}