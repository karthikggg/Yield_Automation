export function matchAndUpdateListings(oldListing, updatedListing) {
  const messages = [];
  const result = JSON.parse(JSON.stringify(updatedListing));
  let matchedCount = 0;
  
  // Normalize date format
  const normalizeDate = (dateStr) => {
    if (!dateStr) return '';
    
    // If numeric (Excel format)
    if (/^\d+\./.test(String(dateStr).trim())) {
      const excelDate = parseFloat(dateStr);
      const date = new Date((excelDate - 25569) * 86400 * 1000);
      return date.toLocaleDateString('en-US', { 
        month: 'numeric', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
    
    // Extract date from "Tue 4/28/2026" format
    const dateMatch = String(dateStr).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (dateMatch) {
      return `${dateMatch[1]}/${dateMatch[2]}/${dateMatch[3]}`;
    }
    
    return String(dateStr).trim();
  };
  
  // Normalize time
  const normalizeTime = (timeStr) => {
    if (!timeStr) return '';
    return String(timeStr).replace(/(\d+)\.(\d{2})\s*(AM|PM)/i, '$1:$2 $3').trim();
  };
  
  // Match logic
  const matchRecord = (oldRecord, updatedRecord) => {
    const oldDate = normalizeDate(oldRecord.Date);
    const updatedDate = normalizeDate(updatedRecord.Date);
    const oldStartTime = normalizeTime(oldRecord['Start Time']);
    const updatedStartTime = normalizeTime(updatedRecord['Start Time']);
    const oldEndTime = normalizeTime(oldRecord['End Time']);
    const updatedEndTime = normalizeTime(updatedRecord['End Time']);
    const oldEpisode = String(oldRecord['Episode Name']).toLowerCase().trim();
    const updatedEpisode = String(updatedRecord['Episode Name']).toLowerCase().trim();
    
    return (
      oldDate === updatedDate &&
      oldStartTime === updatedStartTime &&
      oldEndTime === updatedEndTime &&
      oldEpisode === updatedEpisode
    );
  };
  
  // Check each old listing record
  oldListing.forEach((oldRecord) => {
    // Find matching record in updated listing
    const matchedIndex = result.findIndex(updatedRecord => 
      matchRecord(oldRecord, updatedRecord)
    );
    
    if (matchedIndex !== -1) {
      const updatedRecord = result[matchedIndex];
      
      // Check group mismatch
      if (oldRecord.Group && updatedRecord.Group && oldRecord.Group !== updatedRecord.Group) {
        messages.push({
          type: 'warning',
          episode: oldRecord['Episode Name'],
          date: normalizeDate(oldRecord.Date),
          message: `Group mismatch: Old="${oldRecord.Group}" vs Updated="${updatedRecord.Group}"`
        });
      }
      
      // UPDATE the matched record with old listing data
      result[matchedIndex] = {
        ...updatedRecord,
        'Episode Name': oldRecord['Episode Name'],
        Network: oldRecord.Network,
        Date: oldRecord.Date,
        'Start Time': oldRecord['Start Time'],
        'End Time': oldRecord['End Time'],
        Notes: `${oldRecord.Network}${updatedRecord.Notes ? ' | ' + updatedRecord.Notes : ''}`
      };
      
      matchedCount++;
      
      messages.push({
        type: 'matched',
        episode: oldRecord['Episode Name'],
        date: normalizeDate(oldRecord.Date)
      });
    } else {
      messages.push({
        type: 'no-match',
        episode: oldRecord['Episode Name'],
        date: normalizeDate(oldRecord.Date),
        message: `No match found in Updated Listing`
      });
    }
  });
  
  return {
    updatedListing: result,
    messages: messages,
    summary: {
      totalOldRecords: oldListing.length,
      matched: matchedCount,
      notMatched: oldListing.length - matchedCount,
      warnings: messages.filter(m => m.type === 'warning').length
    }
  };
}