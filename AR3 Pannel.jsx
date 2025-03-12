// AR3 PANEL, made by Alan Ruelas, v1.6, Ultima Actualizacion (12-Mar-2025)


(function (thisObj) {
    function buildUI(thisObj) {
   var panel = thisObj instanceof Panel ? thisObj : new Window("palette", "Quick Actions", undefined, { resizeable: true });

            // Agregar texto como título en la parte superior
            var titleText = panel.add("statictext", undefined, " By Alan Ruelas ©2025 | v.1.6", { multiline: true });
            titleText.alignment = "left";
            titleText.preferredSize.width = 250; // Ajusta el ancho para que se vea todo el texto
    


        var btnLoop = panel.add("button", undefined, "Loop");
        var btnRotate = panel.add("button", undefined, "Rotate -90°");
        var btnWiggle = panel.add("button", undefined, "Wiggle");
        var btnAudioFade = panel.add("button", undefined, "Audio Fade");
        var btnAddBlackFade = panel.add("button", undefined, "Fade Solid Negro");
        var btnAddCamera = panel.add("button", undefined, "[◉] Null Camera");
        var btnMoveLayerBack = panel.add("button", undefined, "Move Layer Back");
        var btnScale100to0 = panel.add("button", undefined, "Scale 100 → 0");
        var btnZStaircase = panel.add("button",     undefined, "||| Escalera Profundidad");
        var btnFlip = panel.add("button", undefined, "Flip");
        var btnFlip3DD = panel.add("button", undefined, "3D FLIP");
        var btnReverseKeyframes = panel.add("button", undefined, "Reverse Keyframes");

        var btnRemoveUnusedFiles = panel.add("button", undefined, "✧˖Limpiar Proyecto˙✧");


        var btnOrganizeProject = panel.add("button", undefined, "Organizar Proyecto");


        var btnResizeComps = panel.add("button", undefined, "⛶ COMP XSIZES");

        // Agregar botón de actualización
        var btnUpdateScript = panel.add("button", undefined, "Actualizar Script");





        var dropdownFX = panel.add("dropdownlist", undefined, [
            "Glitch Opacidad (FLASH)",
            "Rotación Infinita con Eco 3D",
            "3D Planet rotation sim",
            "Movimiento de Cámara Suave y Cinemático",
            "Simulación de Viento en Objetos 3D",
            "Oscilación 3D Natural",
            "Iluminación Dinámica con Movimiento Automático",
            "Movimiento Aleatorio pero Suave",
            "Fade In/Out Automático",
            "Fade In Automático",
            "Fade Out Automático",
            "Auto Parpadeo",
            "Auto Parpadeo RANDOM",
            "Vibración de Cámara Estilo Mano",
            "Levitación",
            "Rotación automática"
        ]);
        dropdownFX.selection = 0;
        var btnApplyFX = panel.add("button", undefined, "Apply FX");

        // Ajustar ancho del menú desplegable
        dropdownFX.preferredSize.width = 189; // Cambia este valor según necesites

        



        // Button click action for rotation -90
        btnRotate.onClick = function () {
            var comp = app.project.activeItem;
            if (comp && comp.selectedLayers.length > 0) {
                app.beginUndoGroup("Set Rotation to -90");
                for (var i = 0; i < comp.selectedLayers.length; i++) {
                    var layer = comp.selectedLayers[i];
                    layer.property("Transform").property("Rotation").setValue(-90);
                }
                app.endUndoGroup();
            } else {
                alert("Please select at least one layer in the active composition.");
            }
        };



        // Botón Loop - Aplica loopOut en todas las propiedades con keyframes seleccionados
        btnLoop.onClick = function () {
            var comp = app.project.activeItem;
            if (comp && comp.selectedLayers.length > 0) {
                app.beginUndoGroup("Loop Expression");
                for (var i = 0; i < comp.selectedLayers.length; i++) {
                    var layer = comp.selectedLayers[i];
                    var selectedProperties = layer.selectedProperties;

                    if (selectedProperties.length > 0) {
                        for (var j = 0; j < selectedProperties.length; j++) {
                            var property = selectedProperties[j];
                            if (property.numKeys > 0) {
                                property.expression = 'loopOut("cycle");';
                            }
                        }
                    }
                }
                app.endUndoGroup();
            } else {
                alert("Please select at least one keyframed property.");
            }
        };

        // Botón Wiggle - Aplica wiggle(1,9) a la posición
        btnWiggle.onClick = function () {
            var comp = app.project.activeItem;
            if (comp && comp.selectedLayers.length > 0) {
                app.beginUndoGroup("Wiggle Expression");
                for (var i = 0; i < comp.selectedLayers.length; i++) {
                    comp.selectedLayers[i].property("Position").expression = 'wiggle(1,9);';
                }
                app.endUndoGroup();
            } else {
                alert("Please select at least one layer.");
            }
        };

      

      // 🔹 Audio Fade - Soporta Click Normal y Option (⌥) + Click
btnAudioFade.onClick = function () {
    var isOptionPressed = ScriptUI.environment.keyboardState.altKey; // Detectar OPTION (⌥) en Mac

    app.beginUndoGroup("Audio Fade");

    if (isOptionPressed) {
        // 🔹 Si presionas OPTION + Click, aplicar fade a TODAS las composiciones
        for (var i = 1; i <= app.project.numItems; i++) {
            var item = app.project.item(i);
            if (item instanceof CompItem) {
                applyAudioFadeToComp(item);
            }
        }
        alert("Fade aplicado en todos los archivos WAV y MP3 en todas las composiciones.");
    } else {
        // 🔹 Click normal: Aplica solo en capas seleccionadas
        var comp = app.project.activeItem;
        if (comp && comp.selectedLayers.length > 0) {
            applyAudioFadeToSelected(comp);
        } else {
            alert("Por favor, selecciona una capa de audio.");
        }
    }

    app.endUndoGroup();
};

// 🔹 Función para aplicar fade solo a las capas seleccionadas en la composición activa
function applyAudioFadeToSelected(comp) {
    for (var i = 0; i < comp.selectedLayers.length; i++) {
        var layer = comp.selectedLayers[i];
        if (layer.audioLevels) {
            var fadeInDuration = 1;
            var fadeOutDuration = 2;
            var inPoint = layer.inPoint;
            var outPoint = layer.outPoint;

            // Aplicar fade-in
            layer.property("Audio Levels").setValueAtTime(inPoint, [-20, -20]);
            layer.property("Audio Levels").setValueAtTime(inPoint + fadeInDuration, [0, 0]);

            // Aplicar fade-out
            layer.property("Audio Levels").setValueAtTime(outPoint - fadeOutDuration, [0, 0]);
            layer.property("Audio Levels").setValueAtTime(outPoint, [-20, -20]);
        }
    }
}

// 🔹 Función para aplicar fade a TODOS los archivos WAV y MP3 en el proyecto
function applyAudioFadeToComp(comp) {
    for (var i = 1; i <= comp.numLayers; i++) {
        var layer = comp.layer(i);
        if (layer instanceof AVLayer && layer.source instanceof FootageItem && layer.source.file) {
            var ext = layer.source.file.name.split('.').pop().toLowerCase();

            // Si es un archivo WAV o MP3, aplicar el fade-in y fade-out
            if (ext === "wav" || ext === "mp3") {
                var fadeInDuration = 1;
                var fadeOutDuration = 2;
                var inPoint = layer.inPoint;
                var outPoint = layer.outPoint;

                // Aplicar fade-in
                layer.property("Audio Levels").setValueAtTime(inPoint, [-20, -20]);
                layer.property("Audio Levels").setValueAtTime(inPoint + fadeInDuration, [0, 0]);

                // Aplicar fade-out
                layer.property("Audio Levels").setValueAtTime(outPoint - fadeOutDuration, [0, 0]);
                layer.property("Audio Levels").setValueAtTime(outPoint, [-20, -20]);
            }
        }
    }
}






        // Botón Flip - Invierte horizontalmente la capa
        btnFlip.onClick = function () {
            var comp = app.project.activeItem;
            if (comp && comp.selectedLayers.length > 0) {
                app.beginUndoGroup("Flip Layer");
                for (var i = 0; i < comp.selectedLayers.length; i++) {
                    var scale = comp.selectedLayers[i].property("Scale").value;
                    comp.selectedLayers[i].property("Scale").setValue([-scale[0], scale[1]]);
                }
                app.endUndoGroup();
            } else {
                alert("Please select at least one layer.");
            }
        };





// 🔹 Add Null Camera - Crea un Null en 3D si hay capas 3D y lo asigna como Parent SOLO a capas sin parent
btnAddCamera.onClick = function () {
    var comp = app.project.activeItem;
    if (!comp || comp.selectedLayers.length === 0) {
        alert("Por favor, selecciona al menos una capa.");
        return;
    }

    app.beginUndoGroup("Add Null Camera");

    var selectedLayers = comp.selectedLayers;
    var is3DLayerPresent = false;
    var layersWithoutParent = [];

    // Verificar si alguna capa seleccionada es 3D y filtrar las que no tienen Parent
    for (var i = 0; i < selectedLayers.length; i++) {
        var layer = selectedLayers[i];
        if (layer.threeDLayer) {
            is3DLayerPresent = true;
        }
        if (layer.parent === null) { // Solo agregamos las capas que no tienen parent
            layersWithoutParent.push(layer);
        }
    }

    // Crear el Null y asignarle el modo 3D si hay capas 3D
    var newNull = comp.layers.addNull();
    newNull.name = "Null Camera";
    newNull.threeDLayer = is3DLayerPresent; // Solo si hay capas 3D

// Centrar el punto de anclaje del Null al centro de la composición
var compCenter = [comp.width / 2, comp.height / 2, 0]; // Centro de la comp
var nullCenter = [newNull.sourceRectAtTime(0, false).width / 2, newNull.sourceRectAtTime(0, false).height / 2, 0];

newNull.transform.anchorPoint.setValue(nullCenter); // Mover el punto de anclaje al centro del Null
newNull.transform.position.setValue(compCenter); // Centrar el Null en la composición


    // Ajustar duración del Null al tiempo de las capas seleccionadas sin parent
    if (layersWithoutParent.length > 0) {
        var inPoint = Math.min.apply(null, layersWithoutParent.map(function(layer) { return layer.inPoint; }));
        var outPoint = Math.max.apply(null, layersWithoutParent.map(function(layer) { return layer.outPoint; }));
        newNull.inPoint = inPoint;
        newNull.outPoint = outPoint;
    }

    // Asignar el Null como Parent SOLO a capas que no tengan Parent
    for (var i = 0; i < layersWithoutParent.length; i++) {
        layersWithoutParent[i].parent = newNull;
    }

    app.endUndoGroup();
};




// 🔹 Flip & Make 3D - Flip horizontal, convierte capa a 3D y ajusta Z a 0
btnFlip3DD.onClick = function () {
    var comp = app.project.activeItem;
    if (comp && comp.selectedLayers.length > 0) {
        app.beginUndoGroup("Flip & Make 3D");

        for (var i = 0; i < comp.selectedLayers.length; i++) {
            var layer = comp.selectedLayers[i];

            // Convertir la capa en 3D
            layer.threeDLayer = true;

            // Hacer flip horizontal
            var scale = layer.property("Scale").value;
            layer.property("Scale").setValue([-scale[0], scale[1], scale[2]]);

            // Cambiar la posición Z de 0 a 1
            var position = layer.property("Position").value;
            layer.property("Position").setValue([position[0], position[1], 1]);
        }

        app.endUndoGroup();
    } else {
        alert("Please select at least one layer.");
    }
};










//NEW BUTTONS //NEW BUTTONS //NEW BUTTONS 



// 🔹 Move Layer Back - Mueve la capa seleccionada a Z = 3855 y escala a 300
btnMoveLayerBack.onClick = function () {
    var comp = app.project.activeItem;
    if (comp && comp.selectedLayers.length > 0) {
        app.beginUndoGroup("Move Layer Back");

        for (var i = 0; i < comp.selectedLayers.length; i++) {
            var layer = comp.selectedLayers[i];

            // Convertir a 3D
            layer.threeDLayer = true;

            // Mover a posición Z = 3855
            var position = layer.property("Position").value;
            layer.property("Position").setValue([position[0], position[1], 3855]);

            // Ajustar escala a 300
            layer.property("Scale").setValue([300, 300, 300]);
        }

        app.endUndoGroup();
    } else {
        alert("Please select at least one layer.");
    }
};


// 🔹 Scale (de Tamaño Original a 0 en toda la duración de la capa)
btnScale100to0.onClick = function () {
    var comp = app.project.activeItem;

    if (!comp || !(comp instanceof CompItem)) {
        alert("Por favor, selecciona una composición.");
        return;
    }

    var selectedLayers = comp.selectedLayers;

    if (selectedLayers.length === 0) {
        alert("Por favor, selecciona al menos una capa.");
        return;
    }

    app.beginUndoGroup("Escalar de Tamaño Original a 0");

    for (var i = 0; i < selectedLayers.length; i++) {
        var layer = selectedLayers[i];

        if (layer.property("Scale")) {
            var scaleProp = layer.property("Scale");
            var originalScale = scaleProp.value; // Tamaño original de la capa

            var startTime = layer.inPoint;  // Inicio en el primer frame de la capa
            var endTime = layer.outPoint;   // Final en el último frame de la capa

            // Agregar keyframes
            scaleProp.setValueAtTime(startTime, originalScale); // Mantiene el tamaño original al inicio
            scaleProp.setValueAtTime(endTime, [0, 0]); // Reduce a 0 al final

            // Agregar interpolación suave
            scaleProp.setInterpolationTypeAtKey(1, KeyframeInterpolationType.LINEAR);
            scaleProp.setInterpolationTypeAtKey(2, KeyframeInterpolationType.EASE_IN);
        }
    }

    app.endUndoGroup();
};





// 🔹 Escalera Profundidad - Organiza capas en profundidad en Z con distribución uniforme
btnZStaircase.onClick = function () {
    var comp = app.project.activeItem;
    var layers = comp.selectedLayers;

    if (comp && layers.length > 1) {
        app.beginUndoGroup("Escalera de Profundidad en Z");

        var maxDepth = 3500;
        var step = maxDepth / (layers.length - 1); // Espaciado uniforme entre capas

        for (var i = 0; i < layers.length; i++) {
            layers[i].threeDLayer = true;

            // La primera capa seleccionada se mantiene en 0, las demás se distribuyen en profundidad
            var zPosition = i === 0 ? 0 : step * i;
            layers[i].property("Position").setValue([layers[i].position.value[0], layers[i].position.value[1], zPosition]);
        }

        app.endUndoGroup();
    } else {
        alert("Selecciona al menos 2 capas.");
    }
};



// 🔹 Ejecuta la función "Time-Reverse Keyframes" en cualquier idioma
btnReverseKeyframes.onClick = function () {
    app.beginUndoGroup("Invertir Keyframes");

    var commandId;

    // Buscar el ID del comando en inglés
    commandId = app.findMenuCommandId("Time-Reverse Keyframes");

    // Si no lo encuentra (porque está en español), busca la versión en español
    if (commandId === 0) {
        commandId = app.findMenuCommandId("Fotograma clave con tiempo inverso");
    }

    // Ejecutar el comando si se encontró en algún idioma
    if (commandId !== 0) {
        app.executeCommand(commandId);
    } else {
        alert("No se pudo encontrar el comando para invertir keyframes.");
    }

    app.endUndoGroup();
};







//*************************************






// ACTUALIZAR Acción del botón: Ejecutar el script .command desde After Effects
btnUpdateScript.onClick = function () {
    var scriptFile = new File("~/downloads/update_ae_script.command");

    if (scriptFile.exists) {
        scriptFile.execute();
        alert("⏳ Ejecutando actualización...\nVerifica Terminal para ingresar contraseña si es necesario.");
    } else {
        alert("❌ Error: No se encontró el script de actualización en el escritorio.");
    }
};











//*************************************








// 🔹 Fade Solid Negro - Solo Fade Out (Sin Fade In)
btnAddBlackFade.onClick = function () {
    var comp = app.project.activeItem;
    if (comp) {
        app.beginUndoGroup("Agregar Fade Solid");

        // Crear el sólido negro
        var solidLayer = comp.layers.addSolid([0, 0, 0], "Fade Solid", comp.width, comp.height, comp.pixelAspect);

        // Ajustar al inicio y duración según Work Area
        solidLayer.startTime = comp.workAreaStart;
        solidLayer.outPoint = comp.workAreaStart + comp.workAreaDuration;

        // Aplicar expresión solo para Fade Out
        var opacity = solidLayer.property("Opacity");
        opacity.expression = 
            'fadeOutTime = 2.4; ' +
            'fadeOutStart = outPoint - fadeOutTime; ' +
            'fadeOut = linear(time, fadeOutStart, outPoint, 0, 100); ' +
            'fadeOut;';

        app.endUndoGroup();
    }
};






// 🔹 Remove Unused Files - Elimina archivos no utilizados en el proyecto, incluyendo audios, pero NO composiciones
btnRemoveUnusedFiles.onClick = function () {
    if (app.project && app.project.numItems > 0) {
        app.beginUndoGroup("Remove Unused Files");

        // Iterar en reversa para evitar problemas al eliminar elementos
        for (var i = app.project.numItems; i > 0; i--) {
            var item = app.project.item(i);

            // Verificar si el item no está en uso en ninguna composición y NO es una composición
            if (!(item instanceof CompItem) && !(item instanceof FolderItem) && item.usedIn.length === 0) {
                try {
                    item.remove();
                } catch (e) {
                    $.writeln("No se pudo eliminar: " + item.name);
                }
            }
        }

        app.endUndoGroup();
        alert("Archivos no utilizados eliminados, incluyendo audios, excepto composiciones.");
    } else {
        alert("No hay un proyecto abierto o no hay archivos.");
    }
};






// 🔹 Organize Project Files - Mueve archivos a carpetas correspondientes y solo crea las necesarias
btnOrganizeProject.onClick = function () {
    if (!app.project || app.project.numItems === 0) {
        alert("No hay archivos en el proyecto.");
        return;
    }

    app.beginUndoGroup("Organizar Archivos del Proyecto");

    // Función para encontrar una carpeta existente o devolver null si no existe
    function findFolder(folderName) {
        for (var i = 1; i <= app.project.numItems; i++) {
            var item = app.project.item(i);
            if (item instanceof FolderItem && item.name === folderName) {
                return item; // Devuelve la carpeta si ya existe
            }
        }
        return null; // No la crea automáticamente
    }

    // Tipos de archivos que se deben mover
    var mediaExtensions = ["mp4", "mov", "avi", "mkv", "jpg", "png", "tif", "tga", "bmp", "gif", "svg", "ai", "psd", "eps", "webp", "CR3", "jpeg"];
    var audioExtensions = ["mp3", "wav", "aac", "ogg", "flac"];

    var movedFiles = 0;
    var totalFiles = 0;

    // Bucle hasta que todos los archivos sean organizados
    do {
        movedFiles = 0; // Reiniciamos el contador en cada iteración

        // Contar cuántos archivos hay en la raíz antes de moverlos
        totalFiles = 0;
        for (var i = 1; i <= app.project.numItems; i++) {
            var item = app.project.item(i);
            if (!(item instanceof FolderItem) && item.parentFolder === app.project.rootFolder) {
                totalFiles++;
            }
        }

        // Si no hay archivos en la raíz, terminamos el proceso
        if (totalFiles === 0) {
            break;
        }

        // Contadores para verificar si es necesario crear carpetas
        var mediaCount = 0, audioCount = 0, compsCount = 0, preCompsCount = 0;

        // Primera pasada: Contar archivos y decidir si se necesitan carpetas
        for (var i = 1; i <= app.project.numItems; i++) {
            var item = app.project.item(i);

            if (item instanceof FootageItem && item.file) {
                var ext = item.file ? item.file.fsName.split('.').pop().toLowerCase() : "";
                if (mediaExtensions.indexOf(ext) !== -1) {
                    mediaCount++;
                } else if (audioExtensions.indexOf(ext) !== -1) {
                    audioCount++;
                }
            } else if (item instanceof CompItem) {
                if (item.name.toLowerCase().indexOf("pre-comp") !== -1 || item.name.toLowerCase().indexOf("precomp") !== -1) {
                    preCompsCount++;
                } else {
                    compsCount++;
                }
            }
        }

        // Crear carpetas solo si hay archivos para mover
        var mediaFolder = mediaCount > 0 ? findFolder("MEDIA") || app.project.items.addFolder("MEDIA") : null;
        var audioFolder = audioCount > 0 ? findFolder("AUDIO") || app.project.items.addFolder("AUDIO") : null;
        var compsFolder = compsCount > 0 ? findFolder("COMPS") || app.project.items.addFolder("COMPS") : null;
        var preCompsFolder = preCompsCount > 0 ? findFolder("PRE-COMPS") || app.project.items.addFolder("PRE-COMPS") : null;

        // Segunda pasada: Mover archivos a las carpetas correspondientes
        for (var i = app.project.numItems; i > 0; i--) {
            var item = app.project.item(i);

            // Ignorar carpetas ya existentes
            if (item instanceof FolderItem || item.parentFolder !== app.project.rootFolder) {
                continue;
            }

            if (item instanceof FootageItem && item.file) {
                var ext = item.file ? item.file.fsName.split('.').pop().toLowerCase() : "";

                if (mediaFolder && mediaExtensions.indexOf(ext) !== -1) {
                    item.parentFolder = mediaFolder;
                    movedFiles++;
                } else if (audioFolder && audioExtensions.indexOf(ext) !== -1) {
                    item.parentFolder = audioFolder;
                    movedFiles++;
                }
            } else if (item instanceof CompItem) {
                if (preCompsFolder && (item.name.toLowerCase().indexOf("pre-comp") !== -1 || item.name.toLowerCase().indexOf("precomp") !== -1)) {
                    item.parentFolder = preCompsFolder;
                    movedFiles++;
                } else if (compsFolder) {
                    item.parentFolder = compsFolder;
                    movedFiles++;
                }
            }
        }

    } while (movedFiles > 0); // Repite hasta que ya no haya más archivos en la raíz

  // 🔹 Nueva función para mover carpetas a EXTRA sin afectar la jerarquía interna
function moveExtraFolders() {
    var extraFolder = findFolder("EXTRA") || app.project.items.addFolder("EXTRA");
    var movedFolders;
    var maxIterations = 50; // 🔹 Evita bucles infinitos (límite de intentos)
    var iterationCount = 0;

    do {
        movedFolders = 0; // Reiniciamos el contador en cada iteración

        for (var i = app.project.numItems; i > 0; i--) {
            var item = app.project.item(i);

            // 🔹 Si no es una carpeta o ya está en EXTRA, la ignoramos
            if (!(item instanceof FolderItem) || item.parentFolder !== app.project.rootFolder) {
                continue;
            }

            // 🔹 Si la carpeta NO es "MEDIA", "AUDIO" o "COMPS", moverla a "EXTRA"
            if (item.name !== "MEDIA" && item.name !== "AUDIO" && item.name !== "COMPS" && item.name !== "EXTRA") {
                item.parentFolder = extraFolder;
                movedFolders++;
            }
        }

        iterationCount++; // Incrementa el contador de iteraciones
        if (iterationCount >= maxIterations) {
            alert("❗ Se alcanzó el límite de iteraciones al mover carpetas a EXTRA. Revisa posibles errores.");
            break; // Sale del bucle para evitar que After Effects se congele
        }

    } while (movedFolders > 0); // 🔹 Repite hasta que todas las carpetas estén en EXTRA
}



    // Ejecutar la función de mover carpetas a EXTRA
    moveExtraFolders();

    app.endUndoGroup();
};








// 🔹 COMP X SIZES
btnResizeComps.onClick = function () {
    var comp = app.project.activeItem;

    if (!comp || !(comp instanceof CompItem)) {
        alert("Por favor, selecciona al menos una composición.");
        return;
    }

    // Crear ventana emergente
    var win = new Window("palette", "Selecciona las dimensiones", undefined, { resizeable: true });
    win.orientation = "column";

    // Agregar checkboxes de resoluciones
    var chk1920x1080 = win.add("checkbox", undefined, "1920 x 1080 (Horizontal)");
    var chk1080x1350 = win.add("checkbox", undefined, "1080 x 1350");
    var chk1080x1080 = win.add("checkbox", undefined, "1080 x 1080");

    // Botón Aplicar
    var btnApply = win.add("button", undefined, "Aplicar");


    // Evento al presionar "Aplicar"
    btnApply.onClick = function () {
        var selectedComps = [];

        // Obtener todas las composiciones seleccionadas en el proyecto
        for (var i = 0; i < app.project.selection.length; i++) {
            if (app.project.selection[i] instanceof CompItem) {
                selectedComps.push(app.project.selection[i]);
            }
        }

        if (selectedComps.length === 0) {
            alert("No hay composiciones seleccionadas.");
            return;
        }

        app.beginUndoGroup("Duplicar y Centrar Composiciones");

        // Limpiar memoria para evitar problemas con composiciones complejas
        app.executeCommand(app.findMenuCommandId("Purge All Memory & Disk Cache"));

        // Función para duplicar y ajustar contenido sin modificar escala
        function duplicateAndAdjust(originalComp, newWidth, newHeight, label) {
            var newComp = originalComp.duplicate();
            newComp.width = newWidth;
            newComp.height = newHeight;
            newComp.name = originalComp.name + " (" + label + ")";

            var widthRatio = newWidth / originalComp.width;
            var heightRatio = newHeight / originalComp.height;

            // Ajustar solo la posición de las capas sin alterar keyframes
            for (var i = 1; i <= newComp.numLayers; i++) {
                var layer = newComp.layer(i);

                // **EVITAR ERROR CON ARCHIVOS DE AUDIO**
                if (layer.source && layer.source.mainSource instanceof FileSource) {
                    var ext = layer.source.mainSource.file ? layer.source.mainSource.file.name.split('.').pop().toLowerCase() : "";
                    if (["wav", "mp3", "aac", "ogg", "flac"].indexOf(ext) !== -1) {
                        continue; // Si es un archivo de audio, lo ignora y no intenta moverlo
                    }
                }

                if (layer.property("Position")) {
                    var pos = layer.property("Position").value;

                    // Calcular nueva posición sin cambiar la animación
                    var newX = pos[0] * widthRatio;
                    var newY = pos[1] * heightRatio;

                    // Aplicar nueva posición solo si no está animada (sin alterar keyframes)
                    if (!layer.property("Position").isTimeVarying) {
                        layer.property("Position").setValue([newX, newY]);
                    } else {
                        // Si tiene keyframes, mantener su expresión original ajustando su centro
                        var expression = "value + [" + (newX - pos[0]) + "," + (newY - pos[1]) + "]";
                        layer.property("Position").expression = expression;
                    }
                }
            }
        }

        var anyChecked = false;

        // Aplicar cambios según selección
        for (var j = 0; j < selectedComps.length; j++) {
            var comp = selectedComps[j];

            if (chk1920x1080.value) {
                duplicateAndAdjust(comp, 1920, 1080, "1920 x 1080");
                anyChecked = true;
                $.sleep(100); // Esperar para asegurar que AE termine la operación antes de continuar
            }
            if (chk1080x1350.value) {
                duplicateAndAdjust(comp, 1080, 1350, "1080 x 1350");
                anyChecked = true;
                $.sleep(100);
            }
            if (chk1080x1080.value) {
                duplicateAndAdjust(comp, 1080, 1080, "1080 x 1080");
                anyChecked = true;
                $.sleep(100);
            }
        }

        app.endUndoGroup();

        if (anyChecked) {
            $.sleep(300); // Esperar un poco para evitar problemas de cierre prematuro
            win.close(); // ✅ Cerrar la ventana solo si al menos una opción fue seleccionada
        } else {
            alert("Debes seleccionar al menos una opción.");
        }
    };

    win.show(); // Mostrar la ventana emergente
};






//NEW BUTTONS //NEW BUTTONS //NEW BUTTONS 






//INSTRUCTIVO //INSTRUCTIVO //INSTRUCTIVO //INSTRUCTIVO //INSTRUCTIVO //INSTRUCTIVO //INSTRUCTIVO //INSTRUCTIVO 

// Asignar helpTip a cada botón
btnLoop.helpTip = "Repite una animación en bucle automáticamente. (Para animaciones que necesiten repetirse infinitamente, tiene que empezar y terminar con el mismo keyframe para que haga el loop correctamente)";
btnWiggle.helpTip = "Aplica un movimiento aleatorio a la capa en la propiedad de posicion";
btnAudioFade.helpTip = "Aplica un fundido de entrada y salida al audio.";
btnFlip.helpTip = "Invierte horizontalmente la capa seleccionada.";
btnAddCamera.helpTip = "Crea un objeto nulo como controlador de cámara. (Y linkea todas las capas seleccionadas al Nulo)";
btnFlip3DD.helpTip = "Convierte la capa en 3D y la invierte horizontalmente. (Para hacer cartas 3D con doble capa, se aplica a la capa que va detras)";
btnAddBlackFade.helpTip = "Agrega un sólido negro con efecto de fade-in y fade-out.";
btnMoveLayerBack.helpTip = "Mueve la capa en profundidad Z y ajusta su tamaño. (Para capas que van al fondo)";
btnScale100to0.helpTip = "Reduce el tamaño de la capa de 100% a 0%. (No altera el tamaño inicial de la capa no se altera)";
btnZStaircase.helpTip = "Organiza capas en profundidad en Z. (HAce el efecto 3D de profundidad)";
btnReverseKeyframes.helpTip = "nvierte la animación de los keyframes seleccionados.(Temporalmente solo sirve en keyframes sencillos)";
btnRemoveUnusedFiles.helpTip = "Elimina archivos no utilizados en el proyecto. (Todo lo que este fuera de cualquier composicion) usando la opcion de (Remove Unused Files)";
btnApplyFX.helpTip = "Aplica el efecto seleccionado en el menu de arriba a la capa.";

btnOrganizeProject.helpTip = "Organiza los archivos, creando carpetas para cada tipo de archivos, como MEDIA, AUDIO, COMPS, ETC";

btnRotate.helpTip = "Rota los archivos a -90";

btnResizeComps.helpTip = "Duplica las composiciones seleccionadas en diferentes resoluciones. AVISO: (El contenido se mueve para centrarse en la nueva composicion, solo verifica que todo este en su lugar :)";






// Descripciones para cada opción del menú desplegable
var fxDescriptions = [
    "Glitch Opacidad (FLASH): Simula un efecto de parpadeo tipo glitch.",
    "Rotación Infinita con Eco 3D: Aplica una rotación infinita con efecto de eco.",
    "3D Planet rotation sim: Simula la rotación de un planeta en 3D.",
    "Movimiento de Cámara Suave y Cinemático: Crea un movimiento de cámara fluido.",
    "Simulación de Viento en Objetos 3D: Simula un efecto de viento en la capa.",
    "Oscilación 3D Natural: Agrega una oscilación suave en 3D.",
    "Iluminación Dinámica con Movimiento Automático: Modifica la luz en base al movimiento.",
    "Movimiento Aleatorio pero Suave: Genera movimientos aleatorios sin cambios bruscos.",
    "Fade In/Out Automático: Aplica un fundido de entrada y salida automático.",
    "Fade In Automático: Aplica solo una entrada suave de opacidad.",
    "Fade Out Automático: Aplica solo una salida suave de opacidad.",
    "Auto Parpadeo: Hace que la capa parpadee regularmente.",
    "Auto Parpadeo RANDOM: Parpadeo aleatorio de opacidad.",
    "Vibración de Cámara Estilo Mano: Simula la vibración de una cámara en mano.",
    "Levitación: Crea un efecto de flotación para la capa.",
    "Rotación automática: Aplica una rotación continua en la capa."
];

// Asignar helpTip dinámicamente al menú desplegable
dropdownFX.onChange = function() {
    var selectedIndex = dropdownFX.selection.index;
    if (selectedIndex >= 0) {
        setTimeout(function() {
            dropdownFX.helpTip = fxDescriptions[selectedIndex];
        }, 100); // Se da un ligero retraso para asegurar la actualización del helpTip
    }
};


//INSTRUCTIVO //INSTRUCTIVO //INSTRUCTIVO //INSTRUCTIVO //INSTRUCTIVO //INSTRUCTIVO //INSTRUCTIVO //INSTRUCTIVO 








          // Aplicar efectos desde el menú desplegable
        btnApplyFX.onClick = function () {
            var comp = app.project.activeItem;
            if (comp && comp.selectedLayers.length > 0 && dropdownFX.selection != null) {
                app.beginUndoGroup("Apply FX");
                var fx = dropdownFX.selection.index;
               var expressions = [
    { property: "Opacity", expression: 'flickerDuration = 2; flickerInterval = 4; minOpacity = 0; maxOpacity = 100; timeOffset = time - inPoint; cycleTime = timeOffset % flickerInterval; cycleTime < flickerDuration ? (Math.random() > 0.5 ? maxOpacity : minOpacity) : maxOpacity;'},
    { property: "Y Rotation", expression: 'rotationSpeed = 50; delay = index * 0.05; (time - delay) * rotationSpeed;', force3D: true },
    { property: "Y Rotation", expression: 'rotationSpeed = 10; time * rotationSpeed;', force3D: true },
    { property: "Position", expression: 't = time * 0.5; x = Math.sin(t) * 100; y = Math.cos(t) * 150; z = value[2] + Math.sin(t) * 50; [x, y, z];' },
    { property: "Position", expression: 'windSpeed = 2; windStrength = 50; x = noise(time * windSpeed) * windStrength; y = noise((time + 10) * windSpeed) * windStrength; z = value[2]; [x, y, z];', force3D: true },
    { property: "Position", expression: 'freq = 2; amp = 50; x = Math.sin(time * freq) * amp; y = Math.cos(time * freq) * amp; z = value[2]; [x, y, z];', createNull: true },
    { property: "Position", expression: 'radius = 500; speed = 1; x = Math.cos(time * speed) * radius; y = Math.sin(time * speed) * radius; z = value[2]; [x, y, z];', createLight: true },
    { property: "Position", expression: 'seedRandom(index, true); speed = 1; range = 80; t = time * speed; x = noise(t) * range; y = noise(t + 10) * range; [value[0] + x, value[1] + y];' },
    { property: "Opacity", expression: 'fadeTime = 1; fadeIn = linear(time, inPoint, inPoint + fadeTime, 0, 100); fadeOut = linear(time, outPoint - fadeTime, outPoint, 100, 0); Math.min(fadeIn, fadeOut);' },
    { property: "Opacity", expression: 'fadeTime = 1; fadeIn = linear(time, inPoint, inPoint + fadeTime, 0, 100); Math.min(fadeIn, 100);' },
    { property: "Opacity", expression: 'fadeTime = 1; fadeOut = linear(time, outPoint - fadeTime, outPoint, 100, 0); Math.min(fadeOut, 100);' },
    { property: "Opacity", expression: 'freq = 30; Math.sin(time * freq * Math.PI * 2) > 0 ? 100 : 0;'  },
    { property: "Opacity", expression: 'blinkSpeed = 5; seedRandom(time, true); random(100) < (Math.sin(time * blinkSpeed * Math.PI * 2) * 50 + 50) ? 100 : 0;' },
    { property: "Position", expression: 'freq = 3; amp = 6; wiggle(freq, amp);' },
    { property: "Position", expression: 'waveHeight = 50; waveSpeed = 2; x = value[0]; y = value[1] + Math.sin(time * waveSpeed) * waveHeight; [x, y];' },
    { property: "Rotation", expression: 'speed = 30; time * speed;' }
];


                for (var i = 0; i < comp.selectedLayers.length; i++) {
                    var layer = comp.selectedLayers[i];

                    if (expressions[fx].force3D && !layer.threeDLayer) {
                        layer.threeDLayer = true;
                    }

                    if (expressions[fx].createNull) {
                        var nullLayer = comp.layers.addNull();
                        nullLayer.name = "Control Null";
                        layer.parent = nullLayer;
                    }

                    if (expressions[fx].createLight) {
                        var lightLayer = comp.layers.addLight("Dynamic Light", [comp.width / 2, comp.height / 2]);
                        var nullLayer = comp.layers.addNull();
                        nullLayer.name = "Light Control";
                        lightLayer.parent = nullLayer;
                    }

                    layer.property(expressions[fx].property).expression = expressions[fx].expression;
                }
                app.endUndoGroup();
            } else {
                alert("Please select a layer and choose an effect.");
            }
        };

       
        panel.alignChildren = "left";
        panel.orientation = "column";
        btnLoop.alignment = "left";
        btnWiggle.alignment = "left";
        btnAudioFade.alignment = "left";
        btnFlip.alignment = "left";
        btnAddCamera.alignment = "left";
        btnFlip3DD.alignment = "left";
        dropdownFX.alignment = "left";
        btnApplyFX.alignment = "left";

        btnMoveLayerBack.alignment = "left";
        btnScale100to0.alignment = "left";
        btnZStaircase.alignment = "left";
        btnReverseKeyframes.alignment = "left";
        btnAddBlackFade.alignment = "left";
        btnRemoveUnusedFiles.alignment = "left";

        btnOrganizeProject.alignment = "left";

        btnRotate.alignment = "left";

        btnResizeComps.alignment = "left";

        btnUpdateScript.alignment = "left";


        panel.layout.layout(true);
        return panel;
    }

    if (thisObj instanceof Panel) {
        buildUI(thisObj);
    } else {
        buildUI(thisObj).show();
    }
})(this);













