
exports.homepage = async (req,res) => {
 const locals = {
 title : ' K-Notes',
  description : 'Free NodeJs Notes App'}
    res.render('index', { // content
        locals,
        layout: '../views/layout/front-page' // page design
    })
}

exports.aboutpage = async (req,res) => {
 const locals = {
 title : 'About',
  description : 'Free NodeJs Notes App'}
    res.render('about',locals)
    // layout: '../views/layout/main.ejs' - Standard
}