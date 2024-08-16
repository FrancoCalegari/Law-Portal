import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import json

class CRUDApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Gestor de Códigos - CRUD")
        self.data = []
        self.selected_index = None

        # Configuración de la interfaz gráfica
        self.create_widgets()

    def create_widgets(self):
        # Botones de carga y guardado
        self.load_button = tk.Button(self.root, text="Cargar JSON", command=self.load_json)
        self.load_button.grid(row=0, column=0, padx=5, pady=5)

        self.save_button = tk.Button(self.root, text="Guardar JSON", command=self.save_json)
        self.save_button.grid(row=0, column=1, padx=5, pady=5)

        # Lista de códigos
        self.code_list = tk.Listbox(self.root, height=15, width=50)
        self.code_list.grid(row=1, column=0, columnspan=2, padx=5, pady=5)
        self.code_list.bind("<<ListboxSelect>>", self.display_selected)

        # Campos de edición
        self.create_edit_fields()

        # Botones CRUD
        self.add_button = tk.Button(self.root, text="Agregar", command=self.add_code)
        self.add_button.grid(row=8, column=0, padx=5, pady=5)

        self.update_button = tk.Button(self.root, text="Actualizar", command=self.update_code)
        self.update_button.grid(row=8, column=1, padx=5, pady=5)

        self.delete_button = tk.Button(self.root, text="Eliminar", command=self.delete_code)
        self.delete_button.grid(row=9, column=0, columnspan=2, padx=5, pady=5)

    def create_edit_fields(self):
        fields = ["title", "link", "image", "jurisdiction", "pdf", "coment"]
        self.entries = {}

        for i, field in enumerate(fields):
            label = tk.Label(self.root, text=field.capitalize())
            label.grid(row=i + 2, column=0, sticky="w", padx=5)
            entry = tk.Entry(self.root, width=50)
            entry.grid(row=i + 2, column=1, padx=5, pady=2)
            self.entries[field] = entry

    def load_json(self):
        file_path = filedialog.askopenfilename(filetypes=[("JSON files", "*.json")])
        if not file_path:
            return

        with open(file_path, "r", encoding="utf-8") as file:
            self.data = json.load(file)

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
        for code in self.data:
            self.code_list.insert(tk.END, code["title"])

    def display_selected(self, event):
        if not self.code_list.curselection():
            return

        self.selected_index = self.code_list.curselection()[0]
        selected_code = self.data[self.selected_index]

        for key, entry in self.entries.items():
            entry.delete(0, tk.END)
            entry.insert(0, selected_code.get(key, ""))

    def add_code(self):
        new_code = {key: entry.get() for key, entry in self.entries.items()}

        if not new_code["title"]:
            messagebox.showwarning("Advertencia", "El campo 'title' es obligatorio.")
            return

        self.data.append(new_code)
        self.refresh_code_list()

    def update_code(self):
        if self.selected_index is None:
            messagebox.showwarning("Advertencia", "No hay un código seleccionado para actualizar.")
            return

        updated_code = {key: entry.get() for key, entry in self.entries.items()}
        self.data[self.selected_index] = updated_code
        self.refresh_code_list()

    def delete_code(self):
        if self.selected_index is None:
            messagebox.showwarning("Advertencia", "No hay un código seleccionado para eliminar.")
            return

        del self.data[self.selected_index]
        self.refresh_code_list()
        self.clear_entries()
        self.selected_index = None

    def clear_entries(self):
        for entry in self.entries.values():
            entry.delete(0, tk.END)

if __name__ == "__main__":
    root = tk.Tk()
    app = CRUDApp(root)
    root.mainloop()
