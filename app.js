document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');
    const selectedFiles = document.querySelector('.selected-files');
    const conversionOptions = document.getElementById('conversion-options');
    const formatGrid = document.getElementById('format-grid');
    const formatSearch = document.getElementById('format-search');
    const convertBtnContainer = document.getElementById('convert-button-container');
    const convertBtn = document.getElementById('convert-btn');
    const selectedFormatSpan = document.getElementById('selected-format');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = progressContainer.querySelector('.progress');
    const progressText = document.getElementById('progress-text');
    const progressDetails = document.getElementById('progress-details');
    const downloadContainer = document.getElementById('download-container');
    const downloadSingleBtn = document.getElementById('download-single-btn');
    const downloadZipBtn = document.getElementById('download-zip-btn');
    const singleFileFormat = document.getElementById('single-file-format');

    let files = [];
    let selectedFormat = '';
    const maxFiles = 100;

    const formatInfo = {
        'gif': {
            name: 'GIF',
            icon: 'fa-image',
            description: 'Graphics Interchange Format',
            accepts: ['image/gif', '.gif']
        },
        'jpg': {
            name: 'JPEG',
            icon: 'fa-image',
            description: 'Joint Photographic Experts Group',
            accepts: ['image/jpeg', 'image/jpg', '.jpg', '.jpeg']
        },
        'tiff': {
            name: 'TIFF',
            icon: 'fa-file-image',
            description: 'Tagged Image File Format',
            accepts: ['image/tiff', '.tiff', '.tif']
        },
        'bmp': {
            name: 'BMP',
            icon: 'fa-image',
            description: 'Bitmap Image File',
            accepts: ['image/bmp', '.bmp']
        },
        'eps': {
            name: 'EPS',
            icon: 'fa-vector-square',
            description: 'Encapsulated PostScript',
            accepts: ['application/postscript', '.eps', '.epsf']
        },
        'svg': {
            name: 'SVG',
            icon: 'fa-bezier-curve',
            description: 'Scalable Vector Graphics',
            accepts: ['image/svg+xml', '.svg']
        },
        'png': {
            name: 'PNG',
            icon: 'fa-file-image',
            description: 'Portable Network Graphics',
            accepts: ['image/png', '.png']
        },
        'webp': {
            name: 'WebP',
            icon: 'fa-image',
            description: 'Web Picture Format',
            accepts: ['image/webp', '.webp']
        },
        'heif': {
            name: 'HEIF',
            icon: 'fa-file-image',
            description: 'High Efficiency Image Format',
            accepts: ['image/heif', 'image/heic', '.heif', '.heic']
        },
        'ai': {
            name: 'AI',
            icon: 'fa-object-group',
            description: 'Adobe Illustrator Document',
            accepts: ['application/illustrator', '.ai']
        },
        'psd': {
            name: 'PSD',
            icon: 'fa-layer-group',
            description: 'Adobe Photoshop Document',
            accepts: ['image/vnd.adobe.photoshop', 'application/x-photoshop', '.psd']
        },
        'pdf': {
            name: 'PDF',
            icon: 'fa-file-pdf',
            description: 'Portable Document Format',
            accepts: ['application/pdf', '.pdf']
        },
        'raw': {
            name: 'RAW',
            icon: 'fa-camera',
            description: 'Raw Image Format',
            accepts: ['image/x-raw', '.raw', '.cr2', '.nef', '.arw', '.dng']
        },
        'indd': {
            name: 'INDD',
            icon: 'fa-book-open',
            description: 'Adobe InDesign Document',
            accepts: ['application/x-indesign', '.indd']
        },
        'avif': {
            name: 'AVIF',
            icon: 'fa-file-image',
            description: 'AV1 Image File Format',
            accepts: ['image/avif', '.avif']
        },
        'dib': {
            name: 'DIB',
            icon: 'fa-image',
            description: 'Device Independent Bitmap',
            accepts: ['image/dib', '.dib']
        },
        'exif': {
            name: 'EXIF',
            icon: 'fa-camera-retro',
            description: 'Exchangeable Image File Format',
            accepts: ['image/exif', '.exif']
        },
        'raster': {
            name: 'Raster',
            icon: 'fa-border-all',
            description: 'Raster Image Format',
            accepts: ['image/x-raster', '.raster', '.rst']
        }
    };

    // Initialize format grid
    function initializeFormatGrid() {
        const formats = Object.entries(formatInfo);
        formatGrid.innerHTML = formats.map(([ext, info]) => `
            <div class="column is-4">
                <div class="format-option" data-format="${ext}">
                    <span class="icon">
                        <i class="fas ${info.icon}"></i>
                    </span>
                    <div class="format-name">${info.name}</div>
                    <div class="format-ext">.${ext}</div>
                </div>
            </div>
        `).join('');

        // Add click handlers
        document.querySelectorAll('.format-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.format-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                selectedFormat = option.dataset.format;
                selectedFormatSpan.textContent = formatInfo[selectedFormat].name;
                updateUI();
            });
        });
    }

    // Initialize format search
    formatSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const formats = Object.entries(formatInfo);
        
        const filteredFormats = formats.filter(([ext, info]) => 
            info.name.toLowerCase().includes(searchTerm) || 
            ext.toLowerCase().includes(searchTerm) ||
            info.description.toLowerCase().includes(searchTerm)
        );

        formatGrid.innerHTML = filteredFormats.length ? 
            filteredFormats.map(([ext, info]) => `
                <div class="column is-4">
                    <div class="format-option ${ext === selectedFormat ? 'selected' : ''}" data-format="${ext}">
                        <span class="icon">
                            <i class="fas ${info.icon}"></i>
                        </span>
                        <div class="format-name">${info.name}</div>
                        <div class="format-ext">.${ext}</div>
                    </div>
                </div>
            `).join('') :
            '<div class="column is-12"><div class="no-formats-found">No matching formats found</div></div>';

        // Reattach click handlers
        document.querySelectorAll('.format-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.format-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                selectedFormat = option.dataset.format;
                selectedFormatSpan.textContent = formatInfo[selectedFormat].name;
                updateUI();
            });
        });
    });

    // Initialize format grid on load
    initializeFormatGrid();

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        dropZone.classList.add('dragover');
    }

    function unhighlight() {
        dropZone.classList.remove('dragover');
    }

    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const droppedFiles = dt.files;
        handleFiles(droppedFiles);
    }

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    function handleFiles(fileList) {
        if (files.length + fileList.length > maxFiles) {
            alert(`You can only upload up to ${maxFiles} files at once.`);
            return;
        }

        Array.from(fileList).forEach(file => {
            const fileExt = file.name.split('.').pop().toLowerCase();
            if (!files.some(f => f.name === file.name)) {
                files.push(file);
                displayFile(file);
            }
        });

        updateUI();
    }

    function displayFile(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        // Create a preview container
        const previewContainer = document.createElement('div');
        previewContainer.className = 'file-preview';
        
        if (file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.svg')) {
            // For image files, create a thumbnail
            const img = document.createElement('img');
            img.className = 'preview-thumbnail';
            const reader = new FileReader();
            
            reader.onload = (e) => {
                img.src = e.target.result;
            };
            
            reader.readAsDataURL(file);
            previewContainer.appendChild(img);
        } else {
            // For non-image files (like PSD, AI, etc.), show an icon
            const icon = document.createElement('i');
            icon.className = `fas fa-file-${getFileIcon(file)} fa-2x`;
            previewContainer.appendChild(icon);
        }

        const fileDetails = document.createElement('div');
        fileDetails.className = 'file-details';
        fileDetails.innerHTML = `
            <span class="file-name">${file.name}</span>
            <span class="file-size">${formatFileSize(file.size)}</span>
        `;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-file button is-small';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.onclick = () => {
            files = files.filter(f => f !== file);
            fileItem.remove();
            updateUI();
        };

        fileItem.appendChild(previewContainer);
        fileItem.appendChild(fileDetails);
        fileItem.appendChild(removeBtn);
        selectedFiles.appendChild(fileItem);
    }

    function getFileIcon(file) {
        const ext = file.name.split('.').pop().toLowerCase();
        switch (ext) {
            case 'psd': return 'image';
            case 'ai': return 'vector-square';
            case 'pdf': return 'pdf';
            case 'eps': return 'vector-square';
            case 'indd': return 'book';
            case 'raw': return 'camera';
            default: return 'image';
        }
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function updateUI() {
        fileList.style.display = files.length > 0 ? 'block' : 'none';
        conversionOptions.style.display = files.length > 0 ? 'block' : 'none';
        convertBtnContainer.style.display = selectedFormat && files.length > 0 ? 'block' : 'none';
    }

    convertBtn.addEventListener('click', async () => {
        if (!selectedFormat) {
            alert('Please select an output format');
            return;
        }

        progressContainer.style.display = 'block';
        convertBtn.disabled = true;
        downloadContainer.style.display = 'none';

        try {
            let convertedFiles = 0;
            const totalFiles = files.length;
            const zip = new JSZip();

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileName = file.name.split('.')[0];
                
                await new Promise(resolve => {
                    let progress = 0;
                    const interval = setInterval(() => {
                        progress += Math.random() * 15;
                        if (progress >= 100) {
                            progress = 100;
                            clearInterval(interval);
                            convertedFiles++;
                            
                            if (totalFiles === 1) {
                                // For single file, create a Blob (in real implementation, this would be the converted file)
                                const blob = new Blob([file], { type: `image/${selectedFormat}` });
                                window.convertedFile = {
                                    blob,
                                    name: `${fileName}.${selectedFormat}`
                                };
                            } else {
                                // Add to ZIP for multiple files
                                zip.file(`${fileName}.${selectedFormat}`, file);
                            }
                            
                            const totalProgress = (convertedFiles / totalFiles) * 100;
                            progressBar.value = totalProgress;
                            progressText.textContent = `Converting... ${Math.round(totalProgress)}%`;
                            progressDetails.textContent = `${convertedFiles} of ${totalFiles} files converted`;
                            
                            resolve();
                        }
                        
                        const fileProgress = Math.min(100, Math.round(progress));
                        progressDetails.textContent = `Converting ${file.name}: ${fileProgress}%`;
                    }, 100);
                });
            }

            progressText.textContent = 'Conversion Complete!';
            progressDetails.textContent = `${convertedFiles} files converted successfully`;
            
            if (files.length === 1) {
                // Show single file download button
                downloadSingleBtn.style.display = 'block';
                downloadZipBtn.style.display = 'none';
                singleFileFormat.textContent = formatInfo[selectedFormat].name;
                
                downloadSingleBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(window.convertedFile.blob);
                    link.download = window.convertedFile.name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                    resetUI();
                };
            } else {
                // Show ZIP download button for multiple files
                downloadSingleBtn.style.display = 'none';
                downloadZipBtn.style.display = 'block';
                
                const content = await zip.generateAsync({ type: 'blob' });
                const zipUrl = URL.createObjectURL(content);
                
                downloadZipBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.href = zipUrl;
                    link.download = `converted_images.zip`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(zipUrl);
                    resetUI();
                };
            }
            
            downloadContainer.style.display = 'block';

        } catch (error) {
            alert('Error during conversion: ' + error.message);
            resetUI();
        }
    });

    function resetUI() {
        files = [];
        selectedFiles.innerHTML = '';
        fileList.style.display = 'none';
        conversionOptions.style.display = 'none';
        progressContainer.style.display = 'none';
        downloadContainer.style.display = 'none';
        convertBtn.disabled = false;
        selectedFormat = '';
        convertBtnContainer.style.display = 'none';
        progressBar.value = 0;
        document.querySelectorAll('.format-option').forEach(opt => opt.classList.remove('selected'));
    }
});
