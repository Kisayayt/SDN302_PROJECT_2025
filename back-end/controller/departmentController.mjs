import DepartmentModel from "../models/DepartmentSchema.mjs";

export const getAllDepartments = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const searchFilter = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const departments = await DepartmentModel.find(searchFilter)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalDepartments = await DepartmentModel.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalDepartments / limit);

    res.json({ departments, totalDepartments, totalPages, currentPage: page });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const createOneDepartment = async (req, res) => {
  try {
    const newDepartment = await DepartmentModel.create(req.body);
    res
      .status(201)
      .json({ message: "Department created successfully", newDepartment });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const deleteOneDepartment = async (req, res) => {
  try {
    const deletedDepartment = await DepartmentModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json({ message: "Department deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getOneDepartment = async (req, res) => {
  try {
    const oneDepartment = await DepartmentModel.findById(req.params.id)
      .populate({
        path: "users",
        select: "name email",
      })
      .populate({
        path: "children",
        select: "name",
      });

    if (!oneDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json({ oneDepartment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { name, parent_id, status } = req.body;
    const departmentId = req.params.id;

    const department = await DepartmentModel.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: "Phòng ban không tồn tại" });
    }

    department.name = name;
    department.parent_id = parent_id || null;
    department.status = status;

    await department.save();

    res.json({ message: "Cập nhật phòng ban thành công", department });
  } catch (error) {
    console.error("Lỗi khi cập nhật phòng ban:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
