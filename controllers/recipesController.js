const token = process.env["API_TOKEN"];
const apiUrl = `https://api.spoonacular.com/recipes/search?query=`;
const apiUrlFinal = `&number=12&apiKey=${token}`;
const apiUrlFinalRecipeById = `&apiKey=${token}`;
const User = require("../Models/users");
const axios = require("axios");
const Recipe = require("../Models/recipeSchema");
const getRecipes = require("../Models/getRecipes");
const getRecipeById = require("../Models/getRecipeById");
const myRecipes = require("../Models/myRecipes");
const ensureLogin = require("connect-ensure-login");
const myCreatedRecipes = require("../Models/myCreatedRecipes");
const uploadCloud = require("../config/cloudinary");
require("dotenv").config();


const recipesController = {

  getAllRecipes: (req, res) => {
    const resultado = [];
    getRecipes
      .find()
      .then((results) => {
        for (let i = 0; i <= 11; i++) {
          const position = Math.floor(Math.random() * results.length);
          resultado.push(results[position]);
        }
        res.render("allrecipes", {
          resultado,
          isMain: true,
          user: req.user,
        });
      })
      .catch((err) => console.log(object));
  },
  getExploreRecipes: (req, res) => {
    const resultado = [];
    let ingredient =
      req.query.type.charAt(0).toUpperCase() + req.query.type.slice(1);

    if (ingredient == undefined) {
      res.render("allrecipes");
    }
    getRecipes
      .find()
      .then((results) => {
        results.forEach((item) => {
          if (item.title.includes(ingredient)) {
            resultado.push(item);
          }
        });
        res.render("allrecipes", {
          resultado: resultado.slice(0, 12),
          user: req.user,
        });
      })
      .catch((error) => console.log(error));
  },
  getRecipes: (req, res) => {
    let ingredient = req.query.ingredients;
    let recipeList = [];
    let recipeIdList = [];
    const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredient[0]},+${ingredient[1]},+${ingredient[2]}${apiUrlFinal}`;

    axios
      .get(apiUrl)
      .then((resp) => {
        resp.data.forEach((recipe) => {
          const { title, image, id, likes } = recipe;

          recipeList.push(recipe);
          recipeIdList.push(id);
        });

        //buscar no banco e filtrar somente as que vão pro insertMany
        getRecipes
          .find({
            id: {
              $in: recipeIdList,
            },
          })
          .then((recipesFromDB) => {
            //se todas as receitas já existem no banco, só renderizar as receitas
            if (recipesFromDB.length === recipeIdList.length) {
              res.render("searchResults", {
                recipesFromDB,
                user: req.user,
              });
            }
            //se as receitas não existem no bd
            else {
              //pegar os ids que já existem no banco de dados
              let recipesIdFromDB = recipesFromDB.map((elem) => elem.id);
              let recipeListFiltered = [];

              //filtrar os ids que não estão no banco para enviar pro insertmany
              recipeListFiltered = recipeList.filter((recipeFiltered) => {
                return !recipesIdFromDB.includes(recipeFiltered.id);
              });

              //inserir somente receitas que não existem no banco
              getRecipes
                .insertMany(recipeListFiltered, {
                  ordered: false,
                })
                .then((recipe) => {
                  //juntar receitas que existem no banco com as que foram inseridas
                  recipesFromDB = [...recipesFromDB, ...recipe];
                  res.render("searchResults", {
                    recipesFromDB,
                    user: req.user,
                  });
                })
                .catch((_) => {
                  res.render("searchResults", {
                    recipeList,
                    user: req.user,
                  });
                });
            }
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  },
  getSpecificRecipe: (req, res) => {
    const id = req.params.id;
    let recipeObjectFromAPI = {};
    let recipeObjectFromAPIArr = [];

    const apiUrl = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false${apiUrlFinalRecipeById}`;

    axios
      .get(apiUrl)
      .then((resp) => {
        const {
          title,
          id,
          image,
          readyInMinutes,
          servings,
          summary,
          aggregateLikes,
          instructions,
        } = resp.data;

        const { name, amount, unit } = resp.data.extendedIngredients;

        resp.data.extendedIngredients.forEach(
          (ingredientsFromExtendedIngredients) => {
            const { name, amount, unit } = ingredientsFromExtendedIngredients;

            extendedIngredientsToDB = {
              name,
              amount,
              unit,
            };

            recipeObjectFromAPIArr.push(extendedIngredientsToDB);
          }
        );

        recipeObjectFromAPI = {
          title,
          id,
          image,
          readyInMinutes,
          servings,
          summary,
          aggregateLikes,
          extendedIngredients: recipeObjectFromAPIArr,
          instructions,
        };

        getRecipeById
          .create({
            title,
            id,
            image,
            readyInMinutes,
            servings,
            summary,
            aggregateLikes,
            extendedIngredients: recipeObjectFromAPIArr,
            instructions,
          })
          .then((receita) => {
            res.render("recipeById", {
              recipeObjectFromAPI,
              user: req.user,
            });
          })
          .catch((error) => {
            res.render("recipeById", {
              recipeObjectFromAPI,
              user: req.user,
            });
          });
      })
      .catch((error) => {
        console.log(error);
        res.redirect("/error");
      });
  },
  postUpdateLikes: (req, res) => {
    let { id } = req.params;

    getRecipes
      .find({
        id: id,
      })
      .then((receita) => {
        let { likes } = receita[0];

        getRecipes
          .findOneAndUpdate(
            {
              id: id,
            },
            {
              $set: {
                likes: (likes += 1),
              },
            },
            {
              new: true,
            }
          )
          .then((_) => {
            res.json({ likes: likes });
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  },
  getMyRecipes: (req, res) => {
    myRecipes
      .find({
        owner: req.user._id,
      })
      .then((myRecipes) => {
        myCreatedRecipes
          .find({
            owner: req.user._id,
          })
          .then((myCreatedRecipes) => {
            res.render("myRecipes", {
              myRecipes,
              myCreatedRecipes,
              user: req.user,
            });
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  },
  getRecipesCopy: (req, res) => {
    let recipeIdFromDb = [];
    let { id } = req.query;

    getRecipeById
      .find({
        id: id,
      })
      .then((recipe) => {
        const {
          title,
          image,
          readyInMinutes,
          id,
          summary,
          servings,
          aggregateLikes,
          instructions,
          extendedIngredients,
        } = recipe[0];

        recipeIdFromDb.push(id);

        myRecipes.create(
          {
            title,
            image,
            readyInMinutes,
            id,
            summary,
            servings,
            aggregateLikes,
            instructions,
            extendedIngredients,
            owner: req.user._id,
          },
          () => {
            myRecipes
              .find({
                owner: req.user._id,
              })
              .then((recipes) => {
                res.redirect("/my-recipes");
              })
              .catch((error) => console.log(error));
          }
        );
      })
      .catch((error) => console.log(error));
  },
  getUser: (req, res) => {
    User.findById(req.params.user)
      .then((user) => {
        res.render("myAccount", {
          user,
        });
      })
      .catch((error) => console.log(error));
  },
  postUserAvatar: async (req, res) => {
    const imgPath = await req.file.url;
    const imgName = await req.file.originalname;
    User.findByIdAndUpdate(
      {
        _id: req.body["id-user"],
      },
      {
        imgPath,
        imgName,
      },
      {
        new: true,
      }
    ).then((user) => {
      res.render("myAccount", {
        user,
      });
    });
  },
  getEditRecipes: (req, res) => {
    myRecipes
      .findOne({
        id: req.query.id,
      })
      .then((recipe) => {
        res.render("editRecipes", {
          recipe,
          user: req.user,
        });
      })
      .catch((error) => console.log(error));
  },
  postEditRecipes: (req, res) => {
    const extendedIngredients = [];

    const { id } = req.query;

    const { summary, instructions, name, unit, amount } = req.body;

    for (i = 0; i < req.body.amount.length; i++) {
      extendedIngredients.push({
        name: req.body.name[i],
        amount: req.body.amount[i],
        unit: req.body.unit[i],
      });
    }

    myRecipes
      .findOneAndUpdate(
        {
          id: id,
          owner: req.user._id,
        },
        {
          summary,
          extendedIngredients,
          instructions,
        },
        {
          new: true,
        }
      )
      .then((recipe) => {
        res.render("editRecipes", {
          recipe,
          user: req.user,
        });
      })
      .catch((error) => console.log(error));
  },
  getEditCreatedRecipes: (req, res) => {
    myCreatedRecipes
      .findOne({
        _id: req.query.id,
      })
      .then((recipe) => {
        res.render("editCreatedRecipes", {
          recipe,
          user: req.user,
        });
      })
      .catch((error) => console.log(error));
  },
  postEditCreatedRecipes: (req, res) => {
    const extendedIngredients = [];

    const { id } = req.query;

    const { summary, instructions, name, unit, amount } = req.body;

    for (i = 0; i < req.body.amount.length; i++) {
      extendedIngredients.push({
        name: req.body.name[i],
        amount: req.body.amount[i],
        unit: req.body.unit[i],
      });
    }

    myCreatedRecipes
      .findOneAndUpdate(
        {
          _id: id,
          owner: req.user._id,
        },
        {
          summary,
          extendedIngredients,
          instructions,
        },
        {
          new: true,
        }
      )
      .then((recipe) => {
        res.render("editCreatedRecipes", {
          recipe,
          user: req.user,
        });
      })
      .catch((error) => console.log(error));
  },
  getRemoveRecipe: (req, res) => {
    const { id } = req.params;

    myRecipes
      .findOneAndRemove({
        id: id,
        owner: req.user._id,
      })
      .then(res.redirect("/my-recipes"))
      .catch((error) => console.log(error));
  },
  getRemoveCreatedRecipe: (req, res) => {
    const { id } = req.params;
    myCreatedRecipes
      .findOneAndRemove({
        _id: id,
        owner: req.user._id,
      })
      .then(res.redirect("/my-recipes"))
      .catch((error) => console.log(error));
  },
  getAddRecipe: (req, res, next) => {
    res.render("addRecipe");
  },
  postAddRecipe: (req, res, next) => {
    let extendedIngredients = [];

    const imgPath = req.file.url;
    const imgName = req.file.originalname;

    const {
      title,
      summary,
      amount,
      unit,
      name,
      instructions,
      readyInMinutes,
      servings,
    } = req.body;

    for (i = 0; i < req.body.amount.length; i++) {
      extendedIngredients.push({
        name: req.body.name[i],
        amount: req.body.amount[i],
        unit: req.body.unit[i],
      });
    }

    myCreatedRecipes
      .create({
        title,
        imgPath,
        imgName,
        readyInMinutes,
        summary,
        servings,
        instructions,
        extendedIngredients: extendedIngredients,
        owner: req.user._id,
      })
      .then(() => {
        res.redirect("/my-recipes");
      })
      .catch((error) => console.log(error));
  },
};

module.exports = recipesController;
