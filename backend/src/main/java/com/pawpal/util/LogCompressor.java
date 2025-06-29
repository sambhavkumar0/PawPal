package com.pawpal.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.zip.GZIPOutputStream;

@Component
public class LogCompressor {
    
    private static final Logger logger = LoggerFactory.getLogger(LogCompressor.class);
    
    @Value("${logging.file.path:logs}")
    private String logDirectory;
    
    @Value("${logging.compression.days-to-keep:7}")
    private int daysToKeep;
    
    /**
     * Automatically compress log files daily at 2 AM
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void compressOldLogs() {
        logger.info("Starting automatic log compression");
        
        try {
            Path logDir = Paths.get(logDirectory);
            if (!Files.exists(logDir)) {
                logger.warn("Log directory does not exist: {}", logDirectory);
                return;
            }
            
            LocalDate cutoffDate = LocalDate.now().minusDays(daysToKeep);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            
            Files.walk(logDir)
                .filter(Files::isRegularFile)
                .filter(path -> path.toString().endsWith(".log"))
                .filter(path -> !path.toString().endsWith(".gz"))
                .forEach(logFile -> {
                    try {
                        // Extract date from filename or use file modification time
                        LocalDate fileDate = getFileDate(logFile);
                        
                        if (fileDate.isBefore(cutoffDate)) {
                            compressLogFile(logFile);
                        }
                        
                    } catch (Exception e) {
                        logger.error("Error processing log file: {}", logFile, e);
                    }
                });
            
            logger.info("Log compression completed successfully");
            
        } catch (Exception e) {
            logger.error("Error during log compression", e);
        }
    }
    
    /**
     * Manually compress a specific log file
     */
    public void compressLogFile(Path logFile) throws IOException {
        logger.info("Compressing log file: {}", logFile);
        
        Path compressedFile = Paths.get(logFile.toString() + ".gz");
        
        try (FileInputStream fis = new FileInputStream(logFile.toFile());
             FileOutputStream fos = new FileOutputStream(compressedFile.toFile());
             GZIPOutputStream gzos = new GZIPOutputStream(fos)) {
            
            byte[] buffer = new byte[8192];
            int length;
            
            while ((length = fis.read(buffer)) > 0) {
                gzos.write(buffer, 0, length);
            }
            
            gzos.finish();
        }
        
        // Verify compression was successful
        if (Files.exists(compressedFile) && Files.size(compressedFile) > 0) {
            Files.delete(logFile);
            logger.info("Log file compressed and original deleted: {} -> {}", 
                       logFile.getFileName(), compressedFile.getFileName());
        } else {
            throw new IOException("Compression failed for: " + logFile);
        }
    }
    
    /**
     * Clean up old compressed log files
     */
    @Scheduled(cron = "0 30 2 * * ?")
    public void cleanupOldCompressedLogs() {
        logger.info("Starting cleanup of old compressed logs");
        
        try {
            Path logDir = Paths.get(logDirectory);
            if (!Files.exists(logDir)) {
                return;
            }
            
            LocalDate cutoffDate = LocalDate.now().minusDays(30); // Keep compressed logs for 30 days
            
            Files.walk(logDir)
                .filter(Files::isRegularFile)
                .filter(path -> path.toString().endsWith(".log.gz"))
                .forEach(compressedFile -> {
                    try {
                        LocalDate fileDate = getFileDate(compressedFile);
                        
                        if (fileDate.isBefore(cutoffDate)) {
                            Files.delete(compressedFile);
                            logger.info("Deleted old compressed log: {}", compressedFile.getFileName());
                        }
                        
                    } catch (Exception e) {
                        logger.error("Error deleting compressed log file: {}", compressedFile, e);
                    }
                });
            
            logger.info("Cleanup of old compressed logs completed");
            
        } catch (Exception e) {
            logger.error("Error during compressed log cleanup", e);
        }
    }
    
    private LocalDate getFileDate(Path file) throws IOException {
        // Try to extract date from filename first (e.g., pawpal-2024-01-15.log)
        String filename = file.getFileName().toString();
        
        // Look for date pattern in filename
        if (filename.matches(".*\\d{4}-\\d{2}-\\d{2}.*")) {
            String dateStr = filename.replaceAll(".*?(\\d{4}-\\d{2}-\\d{2}).*", "$1");
            try {
                return LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            } catch (Exception e) {
                logger.debug("Could not parse date from filename: {}", filename);
            }
        }
        
        // Fall back to file modification time
        return LocalDate.ofEpochDay(Files.getLastModifiedTime(file).toInstant().getEpochSecond() / 86400);
    }
    
    /**
     * Get compression statistics
     */
    public String getCompressionStats() {
        try {
            Path logDir = Paths.get(logDirectory);
            if (!Files.exists(logDir)) {
                return "Log directory does not exist";
            }
            
            long uncompressedSize = Files.walk(logDir)
                .filter(Files::isRegularFile)
                .filter(path -> path.toString().endsWith(".log"))
                .mapToLong(path -> {
                    try {
                        return Files.size(path);
                    } catch (IOException e) {
                        return 0;
                    }
                })
                .sum();
            
            long compressedSize = Files.walk(logDir)
                .filter(Files::isRegularFile)
                .filter(path -> path.toString().endsWith(".log.gz"))
                .mapToLong(path -> {
                    try {
                        return Files.size(path);
                    } catch (IOException e) {
                        return 0;
                    }
                })
                .sum();
            
            long compressedCount = Files.walk(logDir)
                .filter(Files::isRegularFile)
                .filter(path -> path.toString().endsWith(".log.gz"))
                .count();
            
            return String.format("Uncompressed logs: %d bytes, Compressed logs: %d files (%d bytes)", 
                                uncompressedSize, compressedCount, compressedSize);
            
        } catch (IOException e) {
            logger.error("Error getting compression stats", e);
            return "Error retrieving compression statistics";
        }
    }
}
