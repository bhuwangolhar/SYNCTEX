module.exports = (sequelize, DataTypes) => {
  // Define Course model with validation and associations
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    organization_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    course_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: { notEmpty: true }
    },
    course_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { notEmpty: true }
    },
    course_slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { notEmpty: true }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    delivery_mode: {
      type: DataTypes.ENUM('online', 'offline', 'hybrid'),
      defaultValue: 'online'
    },
    course_type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    course_status: {
      type: DataTypes.ENUM('draft', 'active', 'archived'),
      defaultValue: 'draft'
    },
    selling_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    discounted_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    gst_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 18.00
    },
    fee_plan: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    language: {
      type: DataTypes.STRING(50),
      defaultValue: 'English'
    },
    show_on_homepage: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    tableName: 'courses',
    timestamps: true,
    underscored: true
  });

  // Associate with User model for creator
  Course.associate = (models) => {
    if (models.User) {
      Course.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator', required: false });
    }
  };

  return Course;
};
