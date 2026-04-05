/* ——— ADMIN DASHBOARD ——— admin.js ——— */

/* ── SIDEBAR MOBILE TOGGLE ── */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    
    if (sidebar.classList.contains('open')) {
        closeSidebar();
    } else {
        sidebar.classList.add('open');
        if (backdrop) backdrop.classList.add('active');
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
}

/* ── MODAL SYSTEM ── */
function openModal(type) {
    const overlay = document.getElementById('modal-' + type);
    if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(type) {
    const overlay = document.getElementById('modal-' + type);
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function closeModalOnOverlay(event, type) {
    if (event.target === event.currentTarget) closeModal(type);
}

/* ── EDIT MODAL: poblar con datos del código ── */
function openEditModal(code) {
    const form = document.getElementById('editForm');
    form.action = `/admin/codes/${code.id}/edit`;

    document.getElementById('editTitle').value         = code.title      || '';
    document.getElementById('editLink').value          = code.link       || '';
    document.getElementById('editPdf').value           = code.pdf        || '';
    document.getElementById('editComent').value        = code.coment     || '';
    document.getElementById('editExistingImageUrl').value     = code.image_url      || '';
    document.getElementById('editExistingImageFileId').value  = code.image_file_id  || '';

    // Jurisdicción
    const jurisSelect = document.getElementById('editJurisdiction');
    if (jurisSelect) {
        for (let i = 0; i < jurisSelect.options.length; i++) {
            if (jurisSelect.options[i].value === code.jurisdiction) {
                jurisSelect.selectedIndex = i;
                break;
            }
        }
    }

    // Imagen actual
    const currentImg = document.getElementById('editCurrentImg');
    if (currentImg && code.image_url) {
        currentImg.src = code.image_url;
        currentImg.style.display = 'block';
    } else if (currentImg) {
        currentImg.style.display = 'none';
    }

    // Limpiar preview de nueva imagen
    const preview = document.getElementById('editPreview');
    if (preview) { preview.style.display = 'none'; preview.src = ''; }
    const fileInput = document.getElementById('editImageInput');
    if (fileInput) fileInput.value = '';

    openModal('edit');
}

/* ── DELETE MODAL ── */
function confirmDelete(id, title) {
    const form  = document.getElementById('deleteForm');
    const label = document.getElementById('deleteCodeTitle');
    if (form)  form.action   = `/admin/codes/${id}/delete`;
    if (label) label.textContent = '"' + title + '"';
    openModal('delete');
}

/* ── IMAGE PREVIEW ── */
function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    if (!preview) return;
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.src = '';
        preview.style.display = 'none';
    }
}

/* ── TABLE FILTER ── */
function filterTable() {
    const query = document.getElementById('tableSearch').value.toLowerCase().trim();
    const rows  = document.querySelectorAll('#codesTable tbody tr[data-title]');
    let count = 0;
    rows.forEach(row => {
        const match = row.dataset.title.includes(query);
        row.style.display = match ? '' : 'none';
        if (match) count++;
    });
    const counter = document.getElementById('tableCount');
    if (counter) counter.textContent = count + ' registro' + (count !== 1 ? 's' : '');
}

/* ── AUTO DISMISS ALERTS ── */
document.addEventListener('DOMContentLoaded', function () {
    const alert = document.getElementById('alertMsg');
    if (alert) {
        setTimeout(() => {
            alert.style.transition = 'opacity .6s ease';
            alert.style.opacity    = '0';
            setTimeout(() => alert.remove(), 700);
        }, 5000);
    }
});

/* ── ESC KEY TO CLOSE MODALS ── */
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        ['create', 'edit', 'delete'].forEach(closeModal);
    }
});
