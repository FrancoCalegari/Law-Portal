import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import json
import os
import shutil

class CRUDApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Gestor de Códigos - CRUD")
        self.data = []
        self.filtered_data = []
        self.selected_index = None
        self.create_widgets()

    def create_widgets(self):
        style = ttk.Style()
        style.configure("TLabel", font=("Arial", 12))
        style.configure("TButton", font=("Arial", 12))
        style.configure("TEntry", font=("Arial", 12))

        main_frame = tk.Frame(self.root, bg="#f0f0f0")
        main_frame.pack(fill="both", expand=True, padx=20, pady=20)

        title_label = tk.Label(main_frame, text="Gestor de Códigos", font=("Arial", 16, "bold"), bg="#f0f0f0", fg="#333")
        title_label.grid(row=0, column=0, columnspan=3, pady=10)

        self.load_button = ttk.Button(main_frame, text="Cargar JSON", command=self.load_json)
        self.load_button.grid(row=1, column=0, padx=5, pady=5, sticky="ew")

        self.save_button = ttk.Button(main_frame, text="Guardar JSON", command=self.save_json)
        self.save_button.grid(row=1, column=1, padx=5, pady=5, sticky="ew")

        self.search_label = ttk.Label(main_frame, text="Buscar:", background="#f0f0f0")
        self.search_label.grid(row=2, column=0, padx=5, pady=5, sticky="e")

        self.search_entry = ttk.Entry(main_frame, width=40)
        self.search_entry.grid(row=2, column=1, columnspan=2, padx=5, pady=5, sticky="ew")
        self.search_entry.bind("<KeyRelease>", self.search_code)

        self.code_list = tk.Listbox(main_frame, height=15, font=("Arial", 12))
        self.code_list.grid(row=3, column=0, columnspan=3, padx=5, pady=5, sticky="nsew")
        self.code_list.bind("<<ListboxSelect>>", self.display_selected)

        self.create_edit_fields(main_frame)

        self.add_button = ttk.Button(main_frame, text="Agregar", command=self.add_code)
        self.add_button.grid(row=10, column=0, padx=5, pady=5, sticky="ew")

        self.update_button = ttk.Button(main_frame, text="Actualizar", command=self.update_code)
        self.update_button.grid(row=10, column=1, padx=5, pady=5, sticky="ew")

        self.delete_button = ttk.Button(main_frame, text="Eliminar", command=self.delete_code)
        self.delete_button.grid(row=10, column=2, padx=5, pady=5, sticky="ew")

        main_frame.grid_columnconfigure(0, weight=1)
        main_frame.grid_columnconfigure(1, weight=1)
        main_frame.grid_columnconfigure(2, weight=1)
        main_frame.grid_rowconfigure(3, weight=1)

    def create_edit_fields(self, parent_frame):
        fields = ["title", "link", "image", "jurisdiction", "pdf", "coment"]
        self.entries = {}

        for i, field in enumerate(fields):
            label = ttk.Label(parent_frame, text=field.capitalize(), background="#f0f0f0")
            label.grid(row=i + 4, column=0, sticky="e", padx=5, pady=2)
            entry = ttk.Entry(parent_frame, width=40)
            entry.grid(row=i + 4, column=1, padx=5, pady=2, sticky="ew")
            self.entries[field] = entry

        # Botón para seleccionar la imagen
        self.select_image_button = ttk.Button(parent_frame, text="Seleccionar Imagen", command=self.select_image)
        self.select_image_button.grid(row=6, column=2, padx=5, pady=2, sticky="ew")

    def select_image(self):
        file_path = filedialog.askopenfilename(filetypes=[("Image files", "*.png;*.jpg;*.jpeg;*.webp")])
        if file_path:
            # Copiar la imagen seleccionada a la carpeta destino
            destination_folder = "./assets/img/portadas/"
            if not os.path.exists(destination_folder):
                os.makedirs(destination_folder)
            file_name = os.path.basename(file_path)
            destination_path = os.path.join(destination_folder, file_name)
            shutil.copy(file_path, destination_path)

            # Actualizar el campo "image" en el formulario
            self.entries["image"].delete(0, tk.END)
            self.entries["image"].insert(0, destination_path)

    def load_json(self):
        file_path = filedialog.askopenfilename(filetypes=[("JSON files", "*.json")])
        if not file_path:
            return

        with open(file_path, "r", encoding="utf-8") as file:
            self.data = json.load(file)
            self.filtered_data = self.data.copy()

        self.refresh_code_list()

    def save_json(self):
        file_path = filedialog.asksaveasfilename(defaultextension=".json", filetypes=[("JSON files", "*.json")])
        if not file_path:
            return

        with open(file_path, "w", encoding="utf-8") as file:
            json.dump(self.data, file, indent=4)

        messagebox.showinfo("Guardar JSON", "El archivo se ha guardado correctamente.")

    def refresh_code_list(self):
        self.code_list.delete(0, tk.END)
        for code in self.filtered_data:
            self.code_list.insert(tk.END, code["title"])

    def display_selected(self, event):
        if not self.code_list.curselection():
            return

        self.selected_index = self.code_list.curselection()[0]
        selected_code = self.filtered_data[self.selected_index]

        for key, entry in self.entries.items():
            entry.delete(0, tk.END)
            entry.insert(0, selected_code.get(key, ""))

    def add_code(self):
        new_code = {key: entry.get() for key, entry in self.entries.items()}

        if not new_code["title"]:
            messagebox.showwarning("Advertencia", "El campo 'title' es obligatorio.")
            return

        self.data.append(new_code)
        self.filtered_data = self.data.copy()
        self.refresh_code_list()

    def update_code(self):
        if self.selected_index is None:
            messagebox.showwarning("Advertencia", "No hay un código seleccionado para actualizar.")
            return

        updated_code = {key: entry.get() for key, entry in self.entries.items()}
        actual_index = self.data.index(self.filtered_data[self.selected_index])
        self.data[actual_index] = updated_code
        self.filtered_data = self.data.copy()
        self.refresh_code_list()

    def delete_code(self):
        if self.selected_index is None:
            messagebox.showwarning("Advertencia", "No hay un código seleccionado para eliminar.")
            return

        actual_index = self.data.index(self.filtered_data[self.selected_index])
        del self.data[actual_index]
        self.filtered_data = self.data.copy()
        self.refresh_code_list()
        self.clear_entries()
        self.selected_index = None

    def search_code(self, event):
        query = self.search_entry.get().lower()
        self.filtered_data = [code for code in self.data if query in code["title"].lower()]
        self.refresh_code_list()

    def clear_entries(self):
        for entry in self.entries.values():
            entry.delete(0, tk.END)

if __name__ == "__main__":
    root = tk.Tk()
    app = CRUDApp(root)
    root.mainloop()
