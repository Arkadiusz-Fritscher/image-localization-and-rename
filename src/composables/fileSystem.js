import useStore from "@/composables/store.js";
import useUtils from "@/composables/utils.js";
import ExifReader from "exifreader";
import JSZip from "jszip"; // https://stuk.github.io/jszip/documentation/examples.html
import Compressor from "compressorjs";
import { saveAs } from "file-saver";

const { UUID, findNearbyObject, localDate } = useUtils();
const { store, set } = useStore();

export default function useFileSystem() {
  async function openFiles() {
    set((_store) => {
      _store.isLoadingFiles = true;
    });
    const options = {
      multiple: true,
      types: [
        {
          description: "Images",
          accept: {
            "image/*": [".jpeg", ".jpg"],
          },
        },
      ],
    };

    const fileHandles = await window.showOpenFilePicker(options);
    removeMatchesAndStoreHandles(fileHandles);

    return fileHandles;
  }

  function removeMatchesAndStoreHandles(fileHandles) {
    if (store.allFileHandles.length > 0) {
      fileHandles.forEach(async (fileHandle) => {
        let isUnique = true;
        for (const entry of store.allFileHandles) {
          const isSame = await fileHandle.isSameEntry(entry);

          if (isSame) {
            isUnique = false;
            break;
          }
        }

        if (isUnique) {
          set((_store) => {
            _store.allFileHandles.push(fileHandle);
          });
        }
      });
    } else {
      set((_store) => {
        _store.allFileHandles.push(...fileHandles);
      });
    }

    getFiles();
  }

  function getFiles() {
    if (store.allFileHandles.length === 0) {
      return;
    }

    const status = new Promise((resolve, reject) => {
      store.allFileHandles.forEach(async (fileHandle, index, array) => {
        const file = await fileHandle.getFile();
        const tags = await ExifReader.load(file, { expanded: true });
        new Compressor(file, {
          quality: 0.8,
          maxWidth: 1920,
          success(result) {
            const schema = {
              file: result,
              date: localDate(file.lastModified),
              url: URL.createObjectURL(result),
              id: UUID(),
              data: { barcode: "Unbekannt" },
            };

            if (tags.gps) {
              schema.gps = tags.gps;
              schema.data = findNearbyObject(
                tags.gps.Latitude,
                tags.gps.Longitude
              );
            }

            set((_store) => {
              _store.files.push(schema);
            });
            if (index === array.length - 1) resolve();
          },
        });
      });
    });

    status.then(() => {
      set((store) => {
        store.isLoadingFiles = false;
      });
    });
  }

  async function saveFiles() {
    if (!store.files.length) {
      return;
    }

    const zip = new JSZip();

    store.files.forEach((file, i) => {
      zip.file(
        `${file.data.barcode}/${file.data.barcode}_${file.data.type}_${file.date}_${file.id}.jpg`,
        file.file,
        { base64: true }
      );
    });

    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "Sortierte-Bilder.zip");
    });
  }

  return { openFiles, saveFiles };
}
