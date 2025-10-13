import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingCategory, setEditingCategory] = useState("Personal");
  const [editingPriority, setEditingPriority] = useState("Medium");
  const [editingDueDate, setEditingDueDate] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("Personal");
  const [selectedPriority, setSelectedPriority] = useState("Medium");
  const [selectedDueDate, setSelectedDueDate] = useState("");

  const [sortBy, setSortBy] = useState("default"); // default, dueDate, priority, completion
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('pinterest-todo-tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('pinterest-todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (input.trim() === "") return;
    const newTasks = [...tasks, { text: input, done: false, id: Date.now(), category: selectedCategory, priority: selectedPriority, dueDate: selectedDueDate }];
    newTasks.sort((a, b) => a.done - b.done); // Undone tasks first
    setTasks(newTasks);
    setInput("");
    setSelectedDueDate("");
  };

  const toggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].done = !newTasks[index].done;
    newTasks.sort((a, b) => a.done - b.done); // Undone tasks first
    setTasks(newTasks);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditingText(tasks[index].text);
    setEditingCategory(tasks[index].category || "Personal");
    setEditingPriority(tasks[index].priority || "Medium");
    setEditingDueDate(tasks[index].dueDate || "");
  };

  const saveEdit = () => {
    if (editingText.trim() === "") return;
    const newTasks = [...tasks];
    newTasks[editingIndex].text = editingText;
    newTasks[editingIndex].category = editingCategory;
    newTasks[editingIndex].priority = editingPriority;
    newTasks[editingIndex].dueDate = editingDueDate;
    setTasks(newTasks);
    setEditingIndex(null);
    setEditingText("");
    setEditingCategory("Personal");
    setEditingPriority("Medium");
    setEditingDueDate("");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingText("");
    setEditingCategory("Personal");
    setEditingPriority("Medium");
    setEditingDueDate("");
  };

  const clearAllTasks = () => {
    setTasks([]);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
  };

  const getFilteredAndSortedTasks = () => {
    let filteredTasks = [...tasks];

    // Apply search filter first
    if (searchQuery.trim()) {
      filteredTasks = filteredTasks.filter(task =>
        task.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filterCategory !== "all") {
      filteredTasks = filteredTasks.filter(task => task.category === filterCategory);
    }
    if (filterPriority !== "all") {
      filteredTasks = filteredTasks.filter(task => task.priority === filterPriority);
    }
    if (showOverdueOnly) {
      filteredTasks = filteredTasks.filter(task =>
        task.dueDate && new Date(task.dueDate) < new Date() && !task.done
      );
    }

    // Apply sorting
    if (sortBy === "dueDate") {
      filteredTasks.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    } else if (sortBy === "priority") {
      const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
      filteredTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    } else if (sortBy === "completion") {
      filteredTasks.sort((a, b) => a.done - b.done);
    } else {
      // default: undone first
      filteredTasks.sort((a, b) => a.done - b.done);
    }

    return filteredTasks;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden">
      {/* Pastel background elements */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-bubblegum/30 to-peach/25 rounded-full blur-3xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 2 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-periwinkle/35 to-mint/25 rounded-full blur-3xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 2 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-butter/20 to-lavender/20 rounded-full blur-2xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 2 }}
      />

      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-elegant font-bold text-gray-900 mb-2 drop-shadow-lg">
          ✨ My Elegant To-Do List ✨
        </h1>
        <p className="text-gray-800 text-xl font-cute drop-shadow-lg">
          Stay organized with elegance & style 💕
        </p>
      </motion.div>

        <motion.div
          className="glass-card p-8 w-full max-w-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Search Bar */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="relative">
              <motion.input
                className="w-full p-4 pl-12 rounded-2xl border-2 border-rose-200 focus:outline-none focus:ring-4 focus:ring-rose/30 bg-white/70 backdrop-blur-sm font-cute text-lg placeholder-gray-400"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                whileFocus={{ scale: 1.02 }}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-rose-400">
                🔍
              </div>
              {searchQuery && (
                <motion.button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Sorting and Filtering Controls */}
          <motion.div
            className="mb-6 p-4 bg-white/50 rounded-2xl shadow-soft"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-cute text-gray-700 mb-1">Sort by</label>
                <motion.select
                  className="w-full p-3 rounded-xl border-2 border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose bg-white/50 backdrop-blur-sm font-cute"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="default">📋 Default</option>
                  <option value="dueDate">📅 Due Date</option>
                  <option value="priority">🚨 Priority</option>
                  <option value="completion">✅ Completion</option>
                </motion.select>
              </div>
              <div>
                <label className="block text-sm font-cute text-gray-700 mb-1">Category</label>
                <motion.select
                  className="w-full p-3 rounded-xl border-2 border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose bg-white/50 backdrop-blur-sm font-cute"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="all">📂 All</option>
                  <option value="Personal">👤 Personal</option>
                  <option value="Work">💼 Work</option>
                  <option value="Shopping">🛒 Shopping</option>
                  <option value="Health">🏥 Health</option>
                  <option value="Education">📚 Education</option>
                </motion.select>
              </div>
              <div>
                <label className="block text-sm font-cute text-gray-700 mb-1">Priority</label>
                <motion.select
                  className="w-full p-3 rounded-xl border-2 border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose bg-white/50 backdrop-blur-sm font-cute"
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="all">🎯 All</option>
                  <option value="High">🔴 High</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">🟢 Low</option>
                </motion.select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOverdueOnly}
                    onChange={(e) => setShowOverdueOnly(e.target.checked)}
                    className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500"
                  />
                  <span className="text-sm font-cute text-gray-700">⏰ Overdue</span>
                </label>
              </div>
            </div>
          </motion.div>
          {/* Task Counters */}
          <motion.div
            className="mb-6 p-4 bg-white/50 rounded-2xl shadow-soft"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center text-center">
              <div className="flex-1">
                <div className="text-2xl font-elegant font-bold text-rose">{tasks.length}</div>
                <div className="text-sm font-cute text-gray-700">Total</div>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-elegant font-bold text-green-600">{tasks.filter(t => t.done).length}</div>
                <div className="text-sm font-cute text-gray-700">Done</div>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-elegant font-bold text-blue-600">{tasks.filter(t => !t.done).length}</div>
                <div className="text-sm font-cute text-gray-700">Remaining</div>
              </div>
            </div>
          </motion.div>
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <motion.input
              className="flex-1 p-4 rounded-2xl border-2 border-rose-200 focus:outline-none focus:ring-4 focus:ring-rose/30 bg-white/50 backdrop-blur-sm font-cute"
              placeholder="Add a delightful task ✨"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              whileFocus={{ scale: 1.02 }}
            />
            <motion.button
              className="cute-button"
              onClick={addTask}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg font-elegant font-bold">Add Task</span>
                <span className="text-xl">✨</span>
              </span>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-cute text-gray-700 mb-1">Category</label>
              <motion.select
                className="w-full p-3 rounded-xl border-2 border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose bg-white/50 backdrop-blur-sm font-cute"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                whileFocus={{ scale: 1.02 }}
              >
                <option value="Personal">👤 Personal</option>
                <option value="Work">💼 Work</option>
                <option value="Shopping">🛒 Shopping</option>
                <option value="Health">🏥 Health</option>
                <option value="Education">📚 Education</option>
              </motion.select>
            </div>
            <div>
              <label className="block text-sm font-cute text-gray-700 mb-1">Priority</label>
              <motion.select
                className="w-full p-3 rounded-xl border-2 border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose bg-white/50 backdrop-blur-sm font-cute"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                whileFocus={{ scale: 1.02 }}
              >
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🔴 High</option>
              </motion.select>
            </div>
            <div>
              <label className="block text-sm font-cute text-gray-700 mb-1">Due Date</label>
              <motion.input
                type="date"
                className="w-full p-3 rounded-xl border-2 border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose bg-white/50 backdrop-blur-sm font-cute"
                value={selectedDueDate}
                onChange={(e) => setSelectedDueDate(e.target.value)}
                whileFocus={{ scale: 1.02 }}
              />
            </div>
          </div>
        </div>

        {tasks.length > 0 && (
          <motion.button
            className="mb-4 bg-gray-500 text-white font-elegant font-bold px-6 py-2 rounded-full shadow-soft hover:shadow-elegant transition-all duration-300 transform hover:scale-105"
            onClick={clearAllTasks}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Clear All Tasks 🗑️
          </motion.button>
        )}

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <AnimatePresence>
                <motion.ul
                  className="space-y-4"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {getFilteredAndSortedTasks().map((task, i) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={i}>
                      {(provided, snapshot) => (
                        <motion.li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`task-item cursor-move ${
                            snapshot.isDragging ? "shadow-elegant rotate-2" : ""
                          } ${
                            task.done
                              ? "bg-gradient-to-r from-green-50 to-emerald-50 line-through text-gray-600 shadow-soft border border-green-200"
                              : `bg-white/80 backdrop-blur-sm shadow-soft border border-white/50 ${
                                  task.category === "Personal" ? "category-personal" :
                                  task.category === "Work" ? "category-work" :
                                  task.category === "Shopping" ? "category-shopping" :
                                  task.category === "Health" ? "category-health" :
                                  "category-education"
                                }`
                          }`}
                        >
                          {editingIndex === i ? (
                            <div className="flex-1">
                              <input
                                className="w-full p-2 mb-2 rounded-lg border border-rose-200 bg-white/70 font-cute text-lg"
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") saveEdit();
                                  if (e.key === "Escape") cancelEdit();
                                }}
                                autoFocus
                              />
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                                <select
                                  className="p-2 rounded-lg border border-rose-200 bg-white/70 font-cute text-sm"
                                  value={editingCategory}
                                  onChange={(e) => setEditingCategory(e.target.value)}
                                >
                                  <option value="Personal">👤 Personal</option>
                                  <option value="Work">💼 Work</option>
                                  <option value="Shopping">🛒 Shopping</option>
                                  <option value="Health">🏥 Health</option>
                                  <option value="Education">📚 Education</option>
                                </select>
                                <select
                                  className="p-2 rounded-lg border border-rose-200 bg-white/70 font-cute text-sm"
                                  value={editingPriority}
                                  onChange={(e) => setEditingPriority(e.target.value)}
                                >
                                  <option value="Low">🟢 Low</option>
                                  <option value="Medium">🟡 Medium</option>
                                  <option value="High">🔴 High</option>
                                </select>
                                <input
                                  type="date"
                                  className="p-2 rounded-lg border border-rose-200 bg-white/70 font-cute text-sm"
                                  value={editingDueDate}
                                  onChange={(e) => setEditingDueDate(e.target.value)}
                                />
                              </div>
                              <div className="flex gap-2">
                                <motion.button
                                  onClick={saveEdit}
                                  className="text-green-500 hover:text-green-600 text-lg"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  💾
                                </motion.button>
                                <motion.button
                                  onClick={cancelEdit}
                                  className="text-gray-500 hover:text-gray-600 text-lg"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  ❌
                                </motion.button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <motion.span
                                onClick={() => toggleTask(i)}
                                className="flex-1 font-cute text-lg cursor-pointer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {task.done ? (
                                  <span className="flex items-center gap-2">
                                    <motion.span
                                      initial={{ scale: 0, rotate: 0 }}
                                      animate={{ scale: 1, rotate: 0 }}
                                      transition={{ type: "spring", stiffness: 500 }}
                                    >
                                      ✅
                                    </motion.span>
                                    <span className="line-through text-gray-600">{task.text}</span>
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-2">
                                    <motion.span
                                      animate={{ rotate: [0, 360] }}
                                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    >
                                      ⭕
                                    </motion.span>
                                    <span>{task.text}</span>
                                  </span>
                                )}
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-xs px-2 py-1 rounded-full font-cute ${
                                    task.category === "Work" ? "bg-blue-100 text-blue-700" :
                                    task.category === "Personal" ? "bg-purple-100 text-purple-700" :
                                    task.category === "Shopping" ? "bg-green-100 text-green-700" :
                                    task.category === "Health" ? "bg-red-100 text-red-700" :
                                    "bg-yellow-100 text-yellow-700"
                                  }`}>
                                    {task.category}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded-full font-cute ${
                                    task.priority === "High" ? "bg-red-100 text-red-700" :
                                    task.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                                    "bg-green-100 text-green-700"
                                  }`}>
                                    {task.priority}
                                  </span>
                                  {task.dueDate && (
                                    <span className={`text-xs px-2 py-1 rounded-full font-cute ${
                                      new Date(task.dueDate) < new Date() && !task.done ? "bg-red-100 text-red-700 animate-pulse" :
                                      "bg-gray-100 text-gray-700"
                                    }`}>
                                      📅 {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </motion.span>
                              <div className="flex items-center gap-2 ml-4">
                                <motion.button
                                  onClick={() => startEditing(i)}
                                  className="text-blue-500 hover:text-blue-600 text-lg"
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  ✏️
                                </motion.button>
                                <motion.button
                                  onClick={() => deleteTask(i)}
                                  className="text-rose-500 hover:text-red-600 text-xl"
                                  whileHover={{ scale: 1.2, rotate: 90 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  🗑️
                                </motion.button>
                              </div>
                            </>
                          )}
                        </motion.li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </motion.ul>
              </AnimatePresence>
            )}
          </Droppable>
        </DragDropContext>

        {tasks.length === 0 && (
          <motion.div
            className="text-center py-8 text-gray-700 font-cute text-lg drop-shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            No tasks yet! Add something 🌸
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
