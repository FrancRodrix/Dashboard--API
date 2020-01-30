var express = require("express");
var router = express.Router();

var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;
var url = "mongodb://localhost:27017/";

let authenticate = function(req, res, next) {
  var loggedIn = req.session.isLoggedIn;
  if (loggedIn) {
    next();
  } else {
    res.redirect("/signin");
  }
};

let authenticated = function(req, res, next) {
  req.session.isLoggedIn = req.session.isLoggedIn ? true : false;
  if (req.session.isLoggedIn) {
    res.locals.user = req.session.user;
    next();
  } else {
    next();
  }
};
router.use(authenticated);

router.use(authenticate);

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", {
    layout: "dashboardlayout",
    title: "MY DASHBOARD",
    user: req.session.user
  });
});

router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

/* GET users listing. */
router.get("/projects", function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("mLog");
    dbo
      .collection("projects")
      .find({})
      .limit(20)
      .toArray(function(err, projects) {
        if (err) throw err;
        db.close();
        res.render("projects/listprojects", {
          layout: "dashboardlayout",
          projects: projects
        });
      });
  });
});

// create new project
router.get("/projects/new", function(req, res, next) {
  res.render("newproject", {
    layout: "dashboardlayout",
    title: "create new project"
  });
});

router.post("/projects/new", function(req, res, next) {
  let title = req.body.title;
  let image = req.body.image;
  let description = req.body.description;
  let project = { title, image, description };

  // write it to the db
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("mLog");
    let d = new Date();
    // get the projects
    dbo.collection("projects").insertOne(project, function(err, project) {
      if (err) throw err;
      console.log(JSON.stringify(project));
      db.close();
      // redirect to list of projects page
      res.redirect("/projects");
    });
  });
});

router.get("/projects/:id", function(req, res, next) {
  let id = req.params.id;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("mLog");
    dbo
      .collection("projects")
      .findOne({ _id: new ObjectId(id) }, function(err, project) {
        if (err) throw err;
        console.log(JSON.stringify(project));
        db.close();
        res.render("projects/projectdetail", {
          project: project,
          layout: "dashboardlayout"
        });
      });
  });
});

router.post("/projects/:id", function(req, res, next) {
  let id = req.params.id;

  let title = req.body.title;
  let image = req.body.image;
  let description = req.body.description;
  let project = { title, image, description };
  let updatedProject = { $set: project };
    
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("mLog");
    dbo
      .collection("projects")
      .updateOne({ _id: new ObjectId(id) }, updatedProject, function(err, p) {
        if (err) throw err;
        console.log(JSON.stringify(p));
        db.close();
        res.render("projects/projectdetail", {
          project: project,
          layout: "dashboardlayout",
          success: true
        });
      });
  });
});

router.get("/projects/:id/delete", function(req, res, next) {
  let id = req.params.id;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("mLog");
    dbo
      .collection("projects")
      .deleteOne({ _id: new ObjectId(id) }, function(err, p) {
        if (err) throw err;
        console.log(JSON.stringify(p));
        db.close();
        res.redirect("/projects");
      });
  });
});
// blogs list
router.get("/blogs", function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("mLog");
    dbo
      .collection("blog")
      .find({})
      .limit(20)
      .toArray(function(err, blogs) {
        if (err) throw err;
        db.close();
        res.render("projects/listblogs", {
          layout: "dashboardlayout",
          blog: blogs
        });
      });
  });
});
// create new blog
router.get("/blogs/new", function(req, res, next) {
  res.render("newblog", {
    layout: "dashboardlayout",
    title: "create new blog"
  });
});

// submit blog
router.post("/blogs/new", function(req, res, next) {
  let title = req.body.title;
  let imgLink1 = req.body.imgLink1;
  let description = req.body.description;
  let blog = { title, imgLink1, description };

  // write it to the db
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("mLog");
    let d = new Date();
    // get the projects
    dbo.collection("blog").insertOne(blog, function(err, blog) {
      if (err) throw err;
      console.log(JSON.stringify(blog));
      db.close();
      // redirect to list of projects page
      res.redirect("/blogs");
    });
  });
});
// blog detail
router.get("/blogs/:id", function(req, res, next) {
  let id = req.params.id;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("mLog");
    dbo
      .collection("blog")
      .findOne({ _id: new ObjectId(id) }, function(err, blog) {
        if (err) throw err;
        console.log(JSON.stringify(blog));
        db.close();
        res.render("projects/blogdetail", {
          blog: blog,
          layout: "dashboardlayout"
        });
      });
  });
});
// blog update
router.post("/blogs/:id", function(req, res, next) {
  let id = req.params.id;

  let title = req.body.title;
  let image = req.body.image;
  let description = req.body.description;
  let blog = { title, image, description };
  let updatedBlog = { $set: blog };

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("mLog");
    dbo
      .collection("blog")
      .updateOne({ _id: new ObjectId(id) }, updatedBlog, function(err, b) {
        if (err) throw err;
        console.log(JSON.stringify(b));
        db.close();
        res.render("projects/blogdetail", {
          blog: blog,
          layout: "dashboardlayout",
          success: true
        });
      });
  });
});

router.get("/blogs/:id/delete", function(req, res, next) {
  let id = req.params.id;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("mLog");
    dbo
      .collection("blog")
      .deleteOne({ _id: new ObjectId(id) }, function(err, b) {
        if (err) throw err;
        console.log(JSON.stringify(b));
        db.close();
        res.redirect("/blogs");
      });
  });
});
// contact list
router.get("/contacts", function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("mLog");
    dbo
      .collection("register")
      .find({})
      .limit(20)
      .toArray(function(err, contact) {
        if (err) throw err;
        db.close();
        res.render("projects/listcontacts", {
          layout: "dashboardlayout",
          contact: contact
        });
      });
  });
});
// create new contact
router.get("/contacts/new", function(req, res, next) {
  res.render("newcontact", {
    layout: "dashboardlayout",
    title: "create new project"
  });
});

router.post("/contacts/new", function(req, res, next) {
  let fname = req.body.fname;
  let lname = req.body.lname;
  let mobile = req.body.mobile;
  let email = req.body.email;
  let comment = req.body.comment;
  let contact = { fname, lname, mobile, email, comment };

  // write it to the db
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("mLog");
    let d = new Date();
    // get the projects
    dbo.collection("register").insertOne(contact, function(err, contact) {
      if (err) throw err;
      console.log(JSON.stringify(contact));
      db.close();
      // redirect to list of projects page
      res.redirect("/contacts");
    });
  });
});

router.get("/contacts/:id", function(req, res, next) {
  let id = req.params.id;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("mLog");
    dbo
      .collection("register")
      .findOne({ _id: new ObjectId(id) }, function(err, contact) {
        if (err) throw err;
        console.log(JSON.stringify(contact));
        db.close();
        res.render("projects/contactdetail", {
          contact: contact,
          layout: "dashboardlayout"
        });
      });
  });
});

//  contact update
router.post("/contacts/:id", function(req, res, next) {
  let id = req.params.id;
  let fname = req.body.fname;
  let lname = req.body.lname;
  let mobile = req.body.mobile;
  let email = req.body.email;
  let comment = req.body.comment;
  let contact = { fname, lname, mobile, email, comment };
  let updatedContact = { $set: contact };

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("mLog");
    dbo
      .collection("register")
      .updateOne({ _id: new ObjectId(id) }, updatedContact, function(err, c) {
        if (err) throw err;
        console.log(JSON.stringify(c));
        db.close();
        res.render("projects/contactdetail", {
          contact: contact,
          layout: "dashboardlayout",
          success: true
        });
      });
  });
});
// contact delete
router.get("/contacts/:id/delete", function(req, res, next) {
  let id = req.params.id;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("mLog");
    dbo
      .collection("register")
      .deleteOne({ _id: new ObjectId(id) }, function(err, c) {
        if (err) throw err;
        console.log(JSON.stringify(c));
        db.close();
        res.redirect("/contacts");
      });
  });
});
// subscribe
router.get("/subscribe", function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("mLog");
    dbo
      .collection("newsletter")
      .find({})
      .limit(20)
      .toArray(function(err, subscribe) {
        if (err) throw err;
        db.close();
        res.render("projects/listsubscribers", {
          layout: "dashboardlayout",
          subscribe: subscribe
        });
      });
  });
});

// subscribe delete
router.get("/subscribe/:id/delete", function(req, res, next) {
  let id = req.params.id;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("mLog");
    dbo
      .collection("newsletter")
      .deleteOne({ _id: new ObjectId(id) }, function(err, c) {
        if (err) throw err;
        console.log(JSON.stringify(c));
        db.close();
        res.redirect("/subscribe");
      });
  });
});

router.get("/logout", function(req, res, next) {
  req.session.isLoggedIn = false;
  delete req.session.user;
  res.redirect("/signin");
});

module.exports = router;
