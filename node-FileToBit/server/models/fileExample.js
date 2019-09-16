module.exports = function(sequelize, DataTypes) {
  var fileExample = sequelize.define('fileExample', {

     fileName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 255]
      }
    },

    fileExt: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 255]
      }
    },
    
    file: {type: DataTypes.TEXT, allowNull: true}

  })

  return fileExample
}
