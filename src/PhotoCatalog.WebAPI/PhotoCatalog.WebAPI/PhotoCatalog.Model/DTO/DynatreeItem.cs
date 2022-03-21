using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;


// usage example

// DynatreeItem di = new DynatreeItem(new DirectoryInfo(path));
// di.fillAllFilenames()


namespace PhotoCatalog.Model.DTO
{
    
    public class DynatreeItem
    {
        public static string path = "..\\..\\..\\..\\images";
        public string title { get; set; }
        public bool isFolder { get; set; }
        public string key { get; set; }

        public List<DynatreeItem> children;

        public List<string> allFilenames { get; set; }

        public DynatreeItem(FileSystemInfo fsi)
        {
            title = fsi.Name;
            children = new List<DynatreeItem>();

            if (fsi.Attributes == FileAttributes.Directory)
            {
                isFolder = true;
                foreach (FileSystemInfo f in (fsi as DirectoryInfo).GetFileSystemInfos())
                {
                    children.Add(new DynatreeItem(f));
                }
            }
            else
            {
                isFolder = false;
            }
            key = title.Replace(" ", "").ToLower();

        }

        public string JsonToDynatree()
        {
            return JsonConvert.SerializeObject(this, Formatting.Indented);
        }


        public void fillAllFilenames()
        {
            this.allFilenames = new List<string>();
            if (Directory.Exists(DynatreeItem.path))
            {
                ProcessDirectory(path);
            }
        }

        public void ProcessDirectory(string targetDirectory)
        {
            // Process the list of files found in the directory.
            string[] fileEntries = Directory.GetFiles(targetDirectory);
            foreach (string fileName in fileEntries)
                ProcessFile(fileName);

            // Recurse into subdirectories of this directory.
            string[] subdirectoryEntries = Directory.GetDirectories(targetDirectory);
            foreach (string subdirectory in subdirectoryEntries)
                ProcessDirectory(subdirectory);
        }

        // Insert logic for processing found files here.
        public void ProcessFile(string path)
        {
            this.allFilenames.Add(Path.GetFileName(path));
        }

    }
}
