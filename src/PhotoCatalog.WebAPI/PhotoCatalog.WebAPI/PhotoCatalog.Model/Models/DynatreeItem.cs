using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace PhotoCatalog.Model.Models
{
    public class DynatreeItem
    {
        public string Title { get; set; }
        public bool IsFolder { get; set; }
        public string Key { get; set; }

        public List<DynatreeItem> Children;

        public List<string> AllFilePaths { get; set; }

        public DynatreeItem(FileSystemInfo fsi)
        {
            Title = fsi.Name;
            Children = new List<DynatreeItem>();

            if (fsi.Attributes == FileAttributes.Directory)
            {
                IsFolder = true;
                foreach (FileSystemInfo f in (fsi as DirectoryInfo).GetFileSystemInfos())
                {
                    Children.Add(new DynatreeItem(f));
                }
            }
            else
            {
                IsFolder = false;
            }
            Key = Title.Replace(" ", "").ToLower();

        }

        public string JsonToDynatree()
        {
            return JsonConvert.SerializeObject(this, Formatting.Indented);
        }


        public void FillAllFilenames(string path)
        {
            AllFilePaths = new List<string>();
            if (Directory.Exists(path))
            {
                ProcessDirectory(path);
            }
        }

        public void ProcessDirectory(string targetDirectory)
        {
            // Process the list of files found in the directory.
            AllFilePaths.AddRange(Directory.GetFiles(targetDirectory));

            // Recurse into subdirectories of this directory.
            string[] subdirectoryEntries = Directory.GetDirectories(targetDirectory);
            foreach (var subdirectory in subdirectoryEntries)
            {
                ProcessDirectory(subdirectory);
            }
        }

    }
}
